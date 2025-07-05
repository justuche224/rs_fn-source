import axios from "axios";

export type Currency = "BTC" | "ETH" | "USDT" | "SOL" | "BNB" | "LTC";

export interface SystemWalletUploadResponse {
  success: boolean;
  wallet: {
    id: string;
    currency: Currency;
    address: string;
    createdAt: Date;
  };
}

export interface SystemWallet {
  id: string;
  currency: "BTC" | "ETH" | "USDT" | "SOL" | "BNB" | "LTC";
  address: string;
  createdAt: Date;
  updatedAt: Date;
  qrCode: string;
}

export interface UserWallet {
  id: string;
  currency: "BTC" | "ETH" | "USDT" | "SOL" | "BNB" | "LTC";
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWalletCreateResponse {
  id: string;
  userId: string;
  currency: Currency;
  address: string;
  createdAt: Date;
}

export type SystemWalletGetResponse = SystemWallet[];

export const uploadSystemWallet = async (
  currency: Currency,
  address: string,
  wallQRCode: File
): Promise<SystemWalletUploadResponse> => {
  const formData = new FormData();
  formData.append("currency", currency);
  formData.append("address", address);
  formData.append("wallQRCode", wallQRCode);
  const res = await axios.post(
    "https://server.resonantfinance.org/api/wallet/system",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const getSystemWallets = async (): Promise<SystemWalletGetResponse> => {
  const res = await axios.get(
    "https://server.resonantfinance.org/api/wallet/system",
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};

export const deleteSystemWallet = async (id: string): Promise<void> => {
  await axios.delete(
    `https://server.resonantfinance.org/api/wallet/system/${id}`,
    {
      withCredentials: true,
    }
  );
};

export const createUserWallet = async (
  currency: Currency,
  address: string
): Promise<UserWalletCreateResponse> => {
  const res = await axios.post(
    "https://server.resonantfinance.org/api/wallet",
    {
      currency,
      address,
    },
    {
      withCredentials: true,
    }
  );
  return res.data.wallet;
};

export const getUserWallets = async (): Promise<UserWallet[]> => {
  const res = await axios.get(
    "https://server.resonantfinance.org/api/wallet/info",
    {
      withCredentials: true,
    }
  );
  return res.data.wallets;
};

export const deleteUserWallet = async (id: string): Promise<void> => {
  await axios.delete(`https://server.resonantfinance.org/api/wallet/${id}`, {
    withCredentials: true,
  });
};
