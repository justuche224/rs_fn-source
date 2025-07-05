import type { Currency } from "@/types";
import axios from "axios";

const BASE_URL = "https://server.resonantfinance.org/api/withdrawal";

export const applyForWithdrawal = async (
  currency: Currency,
  amount: number,
  destinationAddress: string
) => {
  console.log(currency, amount, destinationAddress);
  await axios.post(
    BASE_URL,
    { currency, amount, destinationAddress },
    { withCredentials: true }
  );
};

export interface UserWithdraw {
  id: string;
  currency: Currency;
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  destinationAddress: string;
  rejectionReason: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getUserWithdrawalHistory = async (): Promise<UserWithdraw[]> => {
  const res = await axios.get(BASE_URL, { withCredentials: true });
  return res.data.data;
};

export interface Withdraw {
  id: string;
  userId: string;
  currency: Currency;
  amount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  destinationAddress: string;
  rejectionReason: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Admin functions
export const getAllWithdrawalHistory = async (): Promise<Withdraw[]> => {
  const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
  return res.data.data;
};

export const approveWithdrawal = async (id: string) => {
  await axios.get(`${BASE_URL}/${id}/approve`, { withCredentials: true });
};

export const rejectWithdrawal = async (id: string, rejectionReason: string) => {
  await axios.post(
    `${BASE_URL}/${id}/reject`,
    JSON.stringify({ rejectionReason }),
    {
      withCredentials: true,
    }
  );
};
