import type { Currency } from "@/types";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/investments";

export const createInvestment = async ({
  planId,
  currency,
}: {
  planId: string;
  currency: Currency;
}) => {
  console.log(
    `Creating investment for planId: ${planId}, currency: ${currency}`
  );
  const res = await axios.post(
    `${BASE_URL}`,
    { planId, currency },
    { withCredentials: true }
  );
  console.log(res.data);
  return res.data.data;
};

export const getUserInvestments = async (): Promise<Investment[]> => {
  const res = await axios.get(`${BASE_URL}`, { withCredentials: true });
  return res.data.data;
};

export const getUserInvestmentById = async (
  investmentId: string
): Promise<Investment> => {
  const res = await axios.get(`${BASE_URL}/${investmentId}`, {
    withCredentials: true,
  });
  return res.data.data;
};

// ADMIN

export const getAllInvestments = async () => {
  const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
  return res.data.data;
};

export const updateInvestmentStatus = async ({
  investmentId,
  status,
}: {
  investmentId: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}) => {
  const res = await axios.post(
    `${BASE_URL}/${investmentId}/status`,
    { status },
    { withCredentials: true }
  );
  return res.data.data;
};

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  currency: Currency;
  txn: string;
  amount: number;
  targetProfit: number;
  currentProfit: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  noOfROI: number;
  profitPercent: number;
  nextProfit: number;
  createdAt: string;
  updatedAt: string;
}
