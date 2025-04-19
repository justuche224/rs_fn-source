import type { Currency } from "@/types";
import axios from "axios";

const BASE_URL = "https://api.resonantfinance.org/api/deposit";

interface UserDeposit {
  id: string;
  userId: string;
  systemWalletId: string;
  currency: Currency;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FAILED";
  rejectionReason: string | null;
  approvedAt: string;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getDeposits = async (): Promise<UserDeposit[]> => {
  const res = await axios.get(BASE_URL, { withCredentials: true });
  return res.data.data;
};

export const makeDeposit = async (
  systemWalletId: string,
  currency: Currency,
  amount: number
) => {
  const res = await axios.post(
    BASE_URL,
    { systemWalletId, currency, amount },
    { withCredentials: true }
  );
  console.log(res.data.data);
  return res.data.data;
};
// Require admin role
export const approveDeposit = async (depositId: string) => {
  const res = await axios.get(`${BASE_URL}/${depositId}/approve`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const rejectDeposit = async (
  depositId: string,
  rejectionReason: string
) => {
  const res = await axios.post(
    `${BASE_URL}/${depositId}/reject`,
    { rejectionReason },
    { withCredentials: true }
  );
  return res.data.data;
};

export const failDeposit = async (depositId: string) => {
  const res = await axios.post(
    `${BASE_URL}/${depositId}/fail`,
    { reason: "technical or processing issue with the deposit." },
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};

interface Deposit {
  id: string;
  userId: string;
  systemWalletId: string;
  currency: Currency;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FAILED";
  rejectionReason: string | null;
  approvedAt: string;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const getAllDeposits = async (): Promise<Deposit[]> => {
  const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
  return res.data.data;
};
