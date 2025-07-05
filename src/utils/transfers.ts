import type { Currency } from "@/types";
import axios from "axios";

const BASE_URL = "https://server.resonantfinance.org/api/transfers";

export const internalTransfer = async (
  fromCurrency: Currency,
  toCurrency: Currency,
  amount: number
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/internal`,
      { fromCurrency, toCurrency, amount },
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error || "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
};

export const interUserTransfer = async (
  fromCurrency: Currency,
  recipientEmail: string,
  amount: number
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/inter-user`,
      { recipientEmail, currency: fromCurrency, amount },
      { withCredentials: true }
    );
    return { success: true, data: response.data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error || "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
};

export const getUserTransfers = async (): Promise<{
  success: boolean;
  data?: UserTransfer[];
  error?: string;
}> => {
  try {
    const response = await axios.get(`${BASE_URL}`, { withCredentials: true });
    return { success: true, data: response.data.data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error || "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
};

// ADMIN
export const getAllTransfers = async (): Promise<{
  success: boolean;
  data?: AdminTransfer[];
  error?: string;
}> => {
  try {
    const response = await axios.get(`${BASE_URL}/all`, {
      withCredentials: true,
    });
    return { success: true, data: response.data.data };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error || "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
};

export const approveTransfer = async (
  transferId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await axios.get(`${BASE_URL}/${transferId}/approve`, {
      withCredentials: true,
    });
    return { success: true };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error || "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
};

export const rejectTransfer = async (
  transferId: string,
  rejectionReason: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await axios.post(
      `${BASE_URL}/${transferId}/reject`,
      { rejectionReason },
      { withCredentials: true }
    );
    return { success: true };
  } catch (err: any) {
    const errorMessage =
      err?.response?.data?.error || "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
};

export interface AdminTransfer {
  id: string;
  senderId: string;
  recipientId: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: string;
  type: string;
  status: string;
  rejectionReason: string | null;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserTransfer {
  id: string;
  senderId: string;
  recipientId: string;
  fromCurrency: Currency;
  toCurrency: Currency;
  amount: string;
  type: string;
  status: string;
  rejectionReason: string | null;
  approvedAt: Date | null;
  rejectedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
