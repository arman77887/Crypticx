import { PrismaClient, Prisma } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface PaymentProviderAdapter {
  initiateDeposit(params: {
    paymentRequestId: string;
    amount: number;
    currency: string;
    merchantInvoiceId: string;
    callbackUrl: string;
  }): Promise<{ redirectUrl?: string; providerData?: Record<string, any> }>;

  verifyPayment(params: {
    paymentRequestId: string;
    providerTxId?: string;
    rawPayload: Record<string, any>;
  }): Promise<{ isVerified: boolean; providerTxId: string; amount: number; rawResponse: Record<string, any> }>;

  processRefund(params: {
    paymentRequestId: string;
    providerTxId: string;
    amount: number;
    reason: string;
  }): Promise<{ isRefunded: boolean; refundTxId: string }>;
}

export class PaymentService {
  /**
   * Safely process payment verification and credit wallet inside an isolated DB transaction.
   */
  public async verifyAndCreditWallet(paymentRequestId: string, providerTxId: string, rawPayload: Record<string, any>) {
    return await prisma.$transaction(async (tx) => {
      // Lock payment request row for updating
      const payment = await tx.paymentRequest.findUnique({
        where: { id: paymentRequestId },
      });

      if (!payment) {
        throw new Error('Payment request not found.');
      }

      if (payment.status === 'COMPLETED') {
        // Idempotent exit: Already processed
        return { status: 'ALREADY_PROCESSED', payment };
      }

      if (payment.status !== 'INITIATED' && payment.status !== 'PENDING_VERIFICATION') {
        throw new Error(`Invalid payment state: ${payment.status}`);
      }

      // Lock user wallet with FOR UPDATE semantics
      const wallet = await tx.$queryRaw<Array<{ id: string; balance: Prisma.Decimal }>>`
        SELECT id, balance FROM wallets WHERE id = ${payment.walletId}::uuid FOR UPDATE
      `;

      if (!wallet || wallet.length === 0) {
        throw new Error('Associated wallet not found.');
      }

      const currentWallet = wallet[0];
      const amountToCredit = new Prisma.Decimal(payment.amount.toString());
      const balanceBefore = new Prisma.Decimal(currentWallet.balance.toString());
      const balanceAfter = balanceBefore.add(amountToCredit);

      // Create Ledger Entry
      const idempotencyKey = `DEP_${payment.id}_${Date.now()}`;
      const ledgerTx = await tx.walletTransaction.create({
        data: {
          walletId: currentWallet.id,
          type: 'DEPOSIT',
          amount: amountToCredit,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          referenceId: payment.id,
          idempotencyKey: idempotencyKey,
          description: `Verified Deposit via ${payment.provider}`,
          status: 'COMPLETED',
          metadata: { providerTxId, rawPayload },
        },
      });

      // Update Wallet Balance
      await tx.wallet.update({
        where: { id: currentWallet.id },
        data: { balance: balanceAfter },
      });

      // Update Payment Request Status
      const updatedPayment = await tx.paymentRequest.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          providerTxId: providerTxId,
          verifiedAt: new Date(),
          gatewayPayload: rawPayload,
        },
      });

      return { status: 'SUCCESS', payment: updatedPayment, ledgerTx };
    });
  }
}
