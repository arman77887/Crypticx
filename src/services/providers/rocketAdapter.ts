import { PaymentProviderAdapter } from '../paymentService';

export class RocketAdapter implements PaymentProviderAdapter {
  public async initiateDeposit(): Promise<never> {
    throw new Error(
      'DBBL Rocket Direct API requires a formal DBBL Merchant Agreement and dedicated server integration. Rocket adapter is currently disabled.'
    );
  }

  public async verifyPayment(): Promise<never> {
    throw new Error('Rocket verification disabled.');
  }

  public async processRefund(): Promise<never> {
    throw new Error('Rocket refund disabled.');
  }
}
