import axios from "axios";

const BASE_URL = "https://api.resonantfinance.org/api/plans";

export interface Plan {
  id: string;
  type: string;
  price: number;
  minRoiAmount: number;
  maxRoiAmount: number;
  commission: number;
  percentage: number;
  duration: number;
  description: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CreatePlan {
  type: string;
  price: string;
  minRoiAmount: string;
  maxRoiAmount: string;
  commission: string;
  percentage: string;
  duration: string;
  description: string;
}

export const getPlans = async (): Promise<Plan[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.data;
};

export const getPlanById = async (id: string): Promise<Plan> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// ADMIN

export const createPlan = async (
  plan: CreatePlan
): Promise<{
  success: boolean;
  planId: number;
}> => {
  const res = await axios.post(BASE_URL, plan, { withCredentials: true });
  return res.data;
};

export const updatePlan = async (
  id: string,
  updateData: {
    type?: string;
    price?: string;
    minRoiAmount?: string;
    maxRoiAmount?: string;
    commission?: string;
    percentage?: string;
    duration?: string;
    description?: string;
  }
) => {
  const parsedData = {
    ...updateData,
    price: updateData.price ? parseFloat(updateData.price) : undefined,
    minRoiAmount: updateData.minRoiAmount
      ? parseFloat(updateData.minRoiAmount)
      : undefined,
    maxRoiAmount: updateData.maxRoiAmount
      ? parseFloat(updateData.maxRoiAmount)
      : undefined,
    commission: updateData.commission
      ? parseFloat(updateData.commission)
      : undefined,
    percentage: updateData.percentage
      ? parseFloat(updateData.percentage)
      : undefined,
    duration: updateData.duration ? parseInt(updateData.duration) : undefined,
  };

  await axios.put(`${BASE_URL}/${id}`, parsedData, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deletePlan = async (planIds: string[]) => {
  await axios.delete(`${BASE_URL}`, {
    data: { planIds },
    withCredentials: true,
  });
};
