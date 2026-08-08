import { PrismaClient, PaymentMethodType } from '@prisma/client';

const prisma = new PrismaClient();

export interface PaymentConfigInput {
  methodType: PaymentMethodType;
  isEnabled: boolean;
  displayName: string;
  accountNumber: string;
  instructionNotes?: string;
  bankDetails?: {
    bankName?: string;
    branchName?: string;
    routingNumber?: string;
    accountHolderName?: string;
  };
}

export class PaymentConfigService {
  /**
   * Admin: Upsert payment configuration for a given provider.
   */
  public async configureMethod(adminId: string, input: PaymentConfigInput, ipAddress?: string) {
    return await prisma.$transaction(async (tx) => {
      const config = await tx.paymentMethodConfig.upsert({
        where: { methodType: input.methodType },
        update: {
          isEnabled: input.isEnabled,
          displayName: input.displayName,
          accountNumber: input.accountNumber,
          instructionNotes: input.instructionNotes,
          bankDetails: input.bankDetails || {},
          updatedAt: new Date(),
        },
        create: {
          methodType: input.methodType,
          isEnabled: input.isEnabled,
          displayName: input.displayName,
          accountNumber: input.accountNumber,
          instructionNotes: input.instructionNotes,
          bankDetails: input.bankDetails || {},
        },
      });

      await tx.paymentAuditLog.create({
        data: {
          actorId: adminId,
          action: 'UPDATE_PAYMENT_CONFIG',
          targetType: 'PAYMENT_METHOD_CONFIG',
          targetId: config.id,
          payload: input as any,
          ipAddress: ipAddress,
        },
      });

      return config;
    });
  }

  /**
   * User: Fetch active payment methods and deposit accounts.
   */
  public async getActiveMethods() {
    return await prisma.paymentMethodConfig.findMany({
      where: { isEnabled: true },
      select: {
        methodType: true,
        displayName: true,
        accountNumber: true,
        instructionNotes: true,
        bankDetails: true,
      },
    });
  }
}
