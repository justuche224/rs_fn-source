import type { Balance } from "@/types";
import axios from "axios";

const BASE_URL = "https://resonantfinance.onrender.com/api/balance";

export const getTotalSystemBalance = async (): Promise<number> => {
  const response = await axios.get(`${BASE_URL}/total`, {
    withCredentials: true,
  });

  const balances: Balance = response.data.data;

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

  const balances: Balance = response.data.data;

  return Object.values(balances).reduce(
    (total, value) => total + parseFloat(value),
    0
  );
};

export const getTotalUserIndividualBalance = async (): Promise<Balance> => {
  const response = await axios.get(`${BASE_URL}/total/user`, {
    withCredentials: true,
  });

  const balances: Balance = response.data.data;

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
