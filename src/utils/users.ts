import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users";

export const getUserById = async (id?: string): Promise<User> => {
  if (!id) return Promise.reject(new Error("No id provided"));
  const res = await axios.get(`${BASE_URL}/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(BASE_URL, {
    withCredentials: true,
  });
  return res.data.data;
};

export const deleteUser = async (ids: string[]) => {
  await axios.delete(BASE_URL, {
    data: { userIds: ids },
    withCredentials: true,
  });
};

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "ADMIN" | "USER";
  phone: string | null;
  country: string | null;
  address: string | null;
  postalCode: string | null;
  dateOfBirth: Date | null;
  twoFactorEnabled: boolean;
  kycVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateUserProps {
  name?: string;
  phone?: string;
  country?: string;
  address?: string;
  postalCode?: string;
  dateOfBirth?: Date;
}

export const updateUser = async (values: UpdateUserProps, userId: string) => {
  await axios.put(`${BASE_URL}/${userId}`, values, {
    withCredentials: true,
  });
};
