import axios from 'axios';
import { PaymentProviderAdapter } from '../paymentService';

export class BkashAdapter implements PaymentProviderAdapter {
  private baseUrl = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bKash.com/v1.2.0-beta';
  private appKey = process.env.BKASH_APP_KEY || '';
  private appSecret = process.env.BKASH_APP_SECRET || '';
  private username = process.env.BKASH_USERNAME || '';
  private password = process.env.BKASH_PASSWORD || '';

  private async getGrantToken(): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/tokenized/checkout/token/grant`,
      { app_key: this.appKey, app_secret: this.appSecret },
      {
        headers: {
          'Content-Type': 'application/json',
          username: this.username,
          password: this.password,
        },
      }
    );
    if (response.data && response.data.id_token) {
      return response.data.id_token;
    }
    throw new Error(`bKash Authentication Failed: ${response.data.statusMessage || 'Unknown error'}`);
  }

  public async initiateDeposit(params: {
    paymentRequestId: string;
    amount: number;
    currency: string;
    merchantInvoiceId: string;
    callbackUrl: string;
  }) {
    const idToken = await this.getGrantToken();
    const response = await axios.post(
      `${this.baseUrl}/tokenized/checkout/create`,
      {
        mode: '0011',
        payerReference: 'N/A',
        callbackURL: params.callbackUrl,
        amount: params.amount.toFixed(2),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: params.merchantInvoiceId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
          'X-APP-Key': this.appKey,
        },
      }
    );

    if (response.data && response.data.statusCode === '0000') {
      return {
        redirectUrl: response.data.bkashURL,
        providerData: { paymentID: response.data.paymentID },
      };
    }
    throw new Error(`bKash Deposit Initiation Failed: ${response.data.statusMessage}`);
  }

  public async verifyPayment(params: {
    paymentRequestId: string;
    providerTxId?: string;
    rawPayload: Record<string, any>;
  }) {
    const paymentID = params.rawPayload.paymentID || params.providerTxId;
    const idToken = await this.getGrantToken();

    const response = await axios.post(
      `${this.baseUrl}/tokenized/checkout/execute`,
      { paymentID },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
          'X-APP-Key': this.appKey,
        },
      }
    );

    if (response.data && response.data.statusCode === '0000' && response.data.transactionStatus === 'Completed') {
      return {
        isVerified: true,
        providerTxId: response.data.trxID,
        amount: parseFloat(response.data.amount),
        rawResponse: response.data,
      };
    }

    return {
      isVerified: false,
      providerTxId: response.data.trxID || paymentID,
      amount: 0,
      rawResponse: response.data,
    };
  }

  public async processRefund(params: {
    paymentRequestId: string;
    providerTxId: string;
    amount: number;
    reason: string;
  }) {
    const idToken = await this.getGrantToken();
    const response = await axios.post(
      `${this.baseUrl}/tokenized/checkout/payment/refund`,
      {
        paymentID: params.paymentRequestId,
        trxID: params.providerTxId,
        amount: params.amount.toFixed(2),
        reason: params.reason,
        sku: 'wallet_refund',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken,
          'X-APP-Key': this.appKey,
        },
      }
    );

    if (response.data && response.data.statusCode === '0000') {
      return { isRefunded: true, refundTxId: response.data.refundTrxID };
    }
    throw new Error(`bKash Refund Failed: ${response.data.statusMessage}`);
  }
}
