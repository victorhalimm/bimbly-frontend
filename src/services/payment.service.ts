import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export type PaymentMethodType = 'qr' | 'va' | 'ewallet';

export type PaymentMethodId = 'qris' | 'va_bca' | 'va_mandiri' | 'va_bni' | 'gopay' | 'ovo' | 'dana';

export type PaymentStatus = 'pending' | 'pending_verification' | 'verified' | 'rejected' | 'expired';

export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  icon: string;
  type: PaymentMethodType;
  description: string;
}

export interface PaymentInstructions {
  type: 'QR Code' | 'Virtual Account' | 'E-Wallet';
  qrCodeUrl?: string;
  vaNumber?: string;
  bank?: string;
  deepLink?: string;
  steps: string[];
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethodId;
  transactionId: string;
  status: PaymentStatus;
  paymentInstructions: PaymentInstructions;
  paymentProofUrl: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  transactionId: string;
  amount: number;
  paymentMethod: PaymentMethodId;
  status: PaymentStatus;
  expiresAt: string;
  instructions: PaymentInstructions;
}

export interface UploadProofResponse {
  success: boolean;
  paymentId: string;
  paymentProofUrl: string;
  status: PaymentStatus;
  message: string;
}

export interface PendingVerificationItem {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethodId;
  transactionId: string;
  paymentProofUrl: string;
  status: PaymentStatus;
  student: {
    id: string;
    fullName: string;
    profileImageUrl: string | null;
  };
  booking: {
    subject: string;
    bookingDate: string;
    startTime: string;
    durationHours: number;
  };
  createdAt: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  paymentId: string;
  transactionId: string;
  bookingId: string;
  status: PaymentStatus;
  verifiedAt: string;
  message: string;
}

export interface RejectPaymentResponse {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  rejectionReason: string;
  message: string;
}

export const paymentService = {
  async getPaymentMethods(): Promise<{ methods: PaymentMethod[] }> {
    const response = await axios.get(`${API_URL}/payments/methods`, {
      withCredentials: true,
    });
    return response.data;
  },

  async initiatePayment(bookingId: string, paymentMethod: PaymentMethodId): Promise<InitiatePaymentResponse> {
    const response = await axios.post(
      `${API_URL}/payments/initiate`,
      { bookingId, paymentMethod },
      { withCredentials: true },
    );
    return response.data;
  },

  async getPaymentByBooking(bookingId: string): Promise<Payment | null> {
    const response = await axios.get(`${API_URL}/payments/booking/${bookingId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async uploadPaymentProof(paymentId: string, file: File): Promise<UploadProofResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_URL}/payments/${paymentId}/upload-proof`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  async getPendingVerifications(): Promise<{ payments: PendingVerificationItem[] }> {
    const response = await axios.get(`${API_URL}/payments/pending-verification`, {
      withCredentials: true,
    });
    return response.data;
  },

  async verifyPayment(paymentId: string): Promise<VerifyPaymentResponse> {
    const response = await axios.post(
      `${API_URL}/payments/${paymentId}/verify`,
      {},
      { withCredentials: true },
    );
    return response.data;
  },

  async rejectPayment(paymentId: string, reason: string): Promise<RejectPaymentResponse> {
    const response = await axios.post(
      `${API_URL}/payments/${paymentId}/reject`,
      { reason },
      { withCredentials: true },
    );
    return response.data;
  },
};
