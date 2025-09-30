import type { Currency } from "@/types";
import axios from "axios";

const BASE_URL = "https://api.resonantfinance.org/api/stats";

export interface TransactionStats {
  deposits: {
    total: number;
    pending: number;
    approvedAmounts: {
      currency: string;
      totalAmount: number;
    }[];
  };
  withdrawals: {
    total: number;
    pending: number;
    approvedAmounts: {
      currency: string;
      totalAmount: number;
    }[];
  };
}

export interface UserStats {
  totalUsers: number;
  kycVerified: number;
  twoFactorEnabled: number;
  emailVerified: number;
  byCountry: {
    country: string;
    count: number;
  }[];
}

export interface TransactionHistory {
  transactions: {
    id: string;
    type: string;
    userId: string;
    currency: string;
    amount: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  total: number;
}

export const getTransactionStats = async (): Promise<TransactionStats> => {
  const res = await axios.get(`${BASE_URL}/transactions`, {
    withCredentials: true,
  });
  return res.data;
};

export const getUserStats = async (): Promise<UserStats> => {
  const res = await axios.get(`${BASE_URL}/users`, {
    withCredentials: true,
  });
  return res.data;
};

export const transactionHistory = async (): Promise<TransactionHistory> => {
  const res = await axios.get(`${BASE_URL}/transaction-history`, {
    withCredentials: true,
  });
  return res.data;
};

export const getUserTransactionHistory = async (
  userId: string
): Promise<UserTrxHistory> => {
  const res = await axios.get(
    `${BASE_URL}/user/${userId}/transaction-history`,
    { withCredentials: true }
  );
  return res.data;
};

export const getReferralStats = async (
  userId: string
): Promise<{
  totalReferrals: number;
  totalRewards: string;
  currency: string;
}> => {
  const res = await axios.get(`${BASE_URL}/user/${userId}/referral-stats`, {
    withCredentials: true,
  });
  // console.log(res.data);
  return res.data;
};

export const getSimpleInvestmentStats = async (
  userId: string
): Promise<{
  totalCount: number;
  totalInvestedAmountByCurrency: Record<Currency, string>;
}> => {
  const res = await axios.get(
    `${BASE_URL}/user/${userId}/investment-basic-stats`,
    { withCredentials: true }
  );
  return res.data;
};

export interface UserTrxHistory {
  transactions: {
    id: string;
    type: "deposit" | "withdrawal" | "investment";
    userId: string;
    currency: Currency;
    amount: string;
    status: "APPROVED" | "PENDING" | "REJECTED" | "FAILED";
    createdAt: Date;
    updatedAt: Date;
  }[];
  total: number;
}
