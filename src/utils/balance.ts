import type { Balance as UserBalance } from "@/types";
import axios from "axios";

// Export the Balance type directly
export type { UserBalance as Balance };

const BASE_URL = "https://resonantfinance.onrender.com/api/balance";

export const getTotalSystemBalance = async (): Promise<number> => {
  const response = await axios.get(`${BASE_URL}/total`, {
    withCredentials: true,
  });

  const balances: UserBalance = response.data.data;

  // Convert values to numbers and sum them
  return Object.values(balances).reduce(
    (total, value) => total + parseFloat(value),
    0
  );
};

export const getTotalUserBalance = async (): Promise<number> => {
  const response = await axios.get(`${BASE_URL}/total/user`, {
    withCredentials: true,
  });

  const balances: UserBalance = response.data.data;

  return Object.values(balances).reduce(
    (total, value) => total + parseFloat(value),
    0
  );
};

export const getTotalUserIndividualBalance = async (): Promise<UserBalance> => {
  const response = await axios.get(`${BASE_URL}/total/user`, {
    withCredentials: true,
  });

  const balances: UserBalance = response.data.data;
  console.log(balances);
  return balances;
};

// New function to get balance for a specific user ID (for admin)
export const getSpecificUserIndividualBalance = async (
  userId: string
): Promise<UserBalance> => {
  const response = await axios.get(`${BASE_URL}/total/user?userId=${userId}`, {
    withCredentials: true,
  });

  const balances: UserBalance = response.data.data;
  return balances;
};

export interface ApprovedWith {
  currency: string;
  totalAmount: number;
}

export const getUserApprovedWithdrawals = async (): Promise<ApprovedWith[]> => {
  const response = await axios.get(`${BASE_URL}/withdrawals/total`, {
    withCredentials: true,
  });
  return response.data.data;
};

export type Currency = "BTC" | "ETH" | "USDT" | "SOL" | "BNB" | "LTC";

export interface AdminAdjustBalanceProps {
  userId: string;
  currency: Currency;
  amount: string; // Amount as a string, can be positive or negative integer
}

export interface AdminAdjustBalanceResponse {
  success: boolean;
  newBalance: string;
}

export const adminAdjustBalance = async (
  data: AdminAdjustBalanceProps
): Promise<AdminAdjustBalanceResponse> => {
  const response = await axios.post(`${BASE_URL}/admin/adjust`, data, {
    withCredentials: true,
  });
  return response.data;
};
