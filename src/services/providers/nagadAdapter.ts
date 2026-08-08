import crypto from 'crypto';
import axios from 'axios';
import { PaymentProviderAdapter } from '../paymentService';

export class NagadAdapter implements PaymentProviderAdapter {
  private baseUrl = process.env.NAGAD_BASE_URL || 'https://sandbox.mypay.com.bd/backend/api/dfs';
  private merchantId = process.env.NAGAD_MERCHANT_ID || '';
  private privateKey = process.env.NAGAD_MERCHANT_PRIVATE_KEY || '';
  private pgPublicKey = process.env.NAGAD_PG_PUBLIC_KEY || '';

  private encryptWithPublicKey(data: string): string {
    const buffer = Buffer.from(data);
    const encrypted = crypto.publicEncrypt(
      { key: this.pgPublicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      buffer
    );
    return encrypted.toString('base64');
  }

  private decryptWithPrivateKey(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      { key: this.privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      buffer
    );
    return decrypted.toString('utf8');
  }

  public async initiateDeposit(params: {
    paymentRequestId: string;
    amount: number;
    currency: string;
    merchantInvoiceId: string;
    callbackUrl: string;
  }) {
    if (!this.merchantId || !this.privateKey) {
      throw new Error('Nagad configuration credentials missing in environment variables.');
    }

    // Official 2-step RSA sensitive handshake flow
    const datetime = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const sensitiveData = {
      merchantId: this.merchantId,
      datetime: datetime,
      orderId: params.merchantInvoiceId,
      challenge: crypto.randomBytes(16).toString('hex'),
    };

    const encryptedData = this.encryptWithPublicKey(JSON.stringify(sensitiveData));
    
    // Call Initialize API
    const initResponse = await axios.post(
      `${this.baseUrl}/check-out/initialize/${this.merchantId}/${params.merchantInvoiceId}`,
      { accountId: this.merchantId, dateTime: datetime, sensitiveData: encryptedData },
      { headers: { 'Content-Type': 'application/json', 'X-KM-Api-Version': 'v-0.2.0' } }
    );

    if (initResponse.data && initResponse.data.sensitiveData) {
      const decryptedInit = JSON.parse(this.decryptWithPrivateKey(initResponse.data.sensitiveData));
      const paymentRefId = decryptedInit.paymentReferenceId;

      return {
        redirectUrl: `${this.baseUrl}/check-out/pay/${paymentRefId}`,
        providerData: { paymentRefId },
      };
    }

    throw new Error('Failed to initialize Nagad payment transaction');
  }

  public async verifyPayment(params: {
    paymentRequestId: string;
    providerTxId?: string;
    rawPayload: Record<string, any>;
  }) {
    const paymentRefId = params.rawPayload.payment_ref_id || params.providerTxId;
    const response = await axios.get(`${this.baseUrl}/verify/payment/${paymentRefId}`, {
      headers: { 'Content-Type': 'application/json', 'X-KM-Api-Version': 'v-0.2.0' },
    });

    if (response.data && response.data.status === 'Success') {
      return {
        isVerified: true,
        providerTxId: response.data.issuerPaymentRefNo || paymentRefId,
        amount: parseFloat(response.data.amount),
        rawResponse: response.data,
      };
    }

    return {
      isVerified: false,
      providerTxId: paymentRefId,
      amount: 0,
      rawResponse: response.data,
    };
  }

  public async processRefund(): Promise<{ isRefunded: boolean; refundTxId: string }> {
    throw new Error('Nagad API requires manual merchant portal application for refunds.');
  }
}
