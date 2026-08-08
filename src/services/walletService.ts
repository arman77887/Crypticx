import { PrismaClient, Prisma, PaymentRequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

export class WalletService {
  /**
   * User: Submit a manual deposit payment request.
   * Hardened against duplicate reference/transaction IDs.
   */
  public async submitDepositRequest(params: {
    userId: string;
    methodType: any;
    amount: number;
    transactionReference: string;
    paymentProofUrl?: string;
  }) {
    const trimmedRef = params.transactionReference.trim();

    if (!trimmedRef) {
      throw new Error('A valid transaction or reference ID is required.');
    }

    if (params.amount <= 0) {
      throw new Error('Deposit amount must be greater than zero.');
    }

    // Retrieve or create user wallet
    const wallet = await prisma.wallet.upsert({
      where: { userId: params.userId },
      update: {},
      create: { userId: params.userId, balance: new Prisma.Decimal(0) },
    });

    // Check method availability
    const config = await prisma.paymentMethodConfig.findUnique({
      where: { methodType: params.methodType },
    });

    if (!config || !config.isEnabled) {
      throw new Error(`Payment method ${params.methodType} is currently disabled.`);
    }

    // Check for duplicate reference ID before writing
    const existingRef = await prisma.paymentRequest.findUnique({
      where: { transactionReference: trimmedRef },
    });

    if (existingRef) {
      throw new Error('This transaction/reference ID has already been submitted.');
    }

    return await prisma.paymentRequest.create({
      data: {
        userId: params.userId,
        walletId: wallet.id,
        methodType: params.methodType,
        amount: new Prisma.Decimal(params.amount),
        transactionReference: trimmedRef,
        paymentProofUrl: params.paymentProofUrl,
        status: PaymentRequestStatus.PENDING,
      },
    });
  }

  /**
   * Admin: Verify and approve a payment request with explicit DB row locking.
   * ONLY here is money credited to the user wallet.
   */
  public async approvePaymentRequest(adminId: string, paymentRequestId: string, adminNotes?: string, ipAddress?: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch & lock payment request
      const paymentRequest = await tx.paymentRequest.findUnique({
        where: { id: paymentRequestId },
      });

      if (!paymentRequest) {
        throw new Error('Payment request not found.');
      }

      if (paymentRequest.status !== PaymentRequestStatus.PENDING) {
        throw new Error(`Payment request is already processed (Status: ${paymentRequest.status}).`);
      }

      // 2. Lock target wallet row using SELECT ... FOR UPDATE
      const walletLock = await tx.$queryRaw<Array<{ id: string; balance: Prisma.Decimal; status: string }>>`
        SELECT id, balance, status FROM wallets WHERE id = ${paymentRequest.walletId}::uuid FOR UPDATE
      `;

      if (!walletLock || walletLock.length === 0) {
        throw new Error('Associated wallet not found.');
      }

      const wallet = walletLock[0];
      if (wallet.status !== 'ACTIVE') {
        throw new Error(`Wallet is ${wallet.status} and cannot receive funds.`);
      }

      const depositAmount = new Prisma.Decimal(paymentRequest.amount.toString());
      const balanceBefore = new Prisma.Decimal(wallet.balance.toString());
      const balanceAfter = balanceBefore.add(depositAmount);
      const idempotencyKey = `DEP_APPROVAL_${paymentRequest.id}`;

      // 3. Create Immutable Ledger Entry
      const ledgerEntry = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          amount: depositAmount,
          balanceBefore: balanceBefore,
          balanceAfter: balanceAfter,
          paymentRequestId: paymentRequest.id,
          idempotencyKey: idempotencyKey,
          description: `Manual deposit verified via ${paymentRequest.methodType} (Ref: ${paymentRequest.transactionReference})`,
          actorId: adminId,
        },
      });

      // 4. Update Wallet Balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter, updatedAt: new Date() },
      });

      // 5. Mark Payment Request as APPROVED with Admin stamp
      const updatedRequest = await tx.paymentRequest.update({
        where: { id: paymentRequest.id },
        data: {
          status: PaymentRequestStatus.APPROVED,
          reviewedBy: adminId,
          reviewedAt: new Date(),
          adminNotes: adminNotes,
        },
      });

      // 6. Record Audit Trail
      await tx.paymentAuditLog.create({
        data: {
          actorId: adminId,
          action: 'APPROVE_PAYMENT_REQUEST',
          targetType: 'PAYMENT_REQUEST',
          targetId: paymentRequest.id,
          payload: {
            creditedAmount: depositAmount.toString(),
            previousBalance: balanceBefore.toString(),
            newBalance: balanceAfter.toString(),
            reference: paymentRequest.transactionReference,
          },
          ipAddress: ipAddress,
        },
      });

      return { paymentRequest: updatedRequest, ledgerEntry };
    });
  }

  /**
   * Admin: Reject a payment request with mandatory reason.
   */
  public async rejectPaymentRequest(adminId: string, paymentRequestId: string, rejectionReason: string, ipAddress?: string) {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new Error('A valid reason is required to reject a payment request.');
    }

    return await prisma.$transaction(async (tx) => {
      const paymentRequest = await tx.paymentRequest.findUnique({
        where: { id: paymentRequestId },
      });

      if (!paymentRequest) {
        throw new Error('Payment request not found.');
      }

      if (paymentRequest.status !== PaymentRequestStatus.PENDING) {
        throw new Error(`Cannot reject a payment request in state ${paymentRequest.status}.`);
      }

      const updatedRequest = await tx.paymentRequest.update({
        where: { id: paymentRequestId },
        data: {
          status: PaymentRequestStatus.REJECTED,
          reviewedBy: adminId,
          reviewedAt: new Date(),
          adminNotes: rejectionReason,
        },
      });

      await tx.paymentAuditLog.create({
        data: {
          actorId: adminId,
          action: 'REJECT_PAYMENT_REQUEST',
          targetType: 'PAYMENT_REQUEST',
          targetId: paymentRequest.id,
          payload: { reason: rejectionReason, reference: paymentRequest.transactionReference },
          ipAddress: ipAddress,
        },
      });

      return updatedRequest;
    });
  }

  /**
   * User / Admin: Fetch user payment request history.
   */
  public async getUserPaymentRequests(userId: string) {
    return await prisma.paymentRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        methodType: true,
        amount: true,
        currency: true,
        transactionReference: true,
        paymentProofUrl: true,
        status: true,
        adminNotes: true,
        createdAt: true,
        reviewedAt: true,
      },
    });
  }

  /**
   * User: Fetch complete wallet transaction ledger.
   */
  public async getWalletLedger(userId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return { balance: '0.0000', transactions: [] };
    }

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });

    return { balance: wallet.balance.toString(), transactions };
  }
}
