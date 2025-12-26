import type { Currency } from "@/types";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/liquidation";

export interface LiquidationSettings {
  id: string;
  maxLiquidationPercentage: number | null;
  gasFeePercentage: number | null;
  isEnabled: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface LiquidationGasWallet {
  id: string;
  currency: Currency;
  network: string;
  address: string;
  qrCode: string | null;
  isActive: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface Liquidation {
  id: string;
  userId: string;
  sourceCurrency: Currency;
  sourceAmount: string;
  targetCrypto: string;
  targetNetwork: string;
  walletProvider: string;
  walletAddress: string;
  gasFeeAmount: string;
  gasFeeCurrency: Currency;
  gasFeeAddress: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";
  rejectionReason: string | null;
  completedAt: string | null;
  rejectedAt: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiquidationWithUser extends Liquidation {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateLiquidationResponse {
  id: string;
  userId: string;
  sourceCurrency: Currency;
  sourceAmount: string;
  targetCrypto: string;
  targetNetwork: string;
  walletProvider: string;
  walletAddress: string;
  gasFeeAmount: string;
  gasFeeCurrency: Currency;
  gasFeeAddress: string;
  gasFeeQrCode: string | null;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export const getLiquidationSettings = async (): Promise<LiquidationSettings | null> => {
  const res = await axios.get(`${BASE_URL}/settings`, { withCredentials: true });
  return res.data.data;
};

export const updateLiquidationSettings = async (
  maxLiquidationPercentage: number | null,
  gasFeePercentage: number | null,
  isEnabled: boolean
): Promise<LiquidationSettings> => {
  const res = await axios.put(
    `${BASE_URL}/settings`,
    { maxLiquidationPercentage, gasFeePercentage, isEnabled },
    { withCredentials: true }
  );
  return res.data.data;
};

export const getLiquidationGasWallets = async (): Promise<LiquidationGasWallet[]> => {
  const res = await axios.get(`${BASE_URL}/gas-wallets`, { withCredentials: true });
  return res.data.data;
};

export const createLiquidationGasWallet = async (
  currency: Currency,
  network: string,
  address: string,
  qrCode?: File
): Promise<LiquidationGasWallet> => {
  const formData = new FormData();
  formData.append("currency", currency);
  formData.append("network", network);
  formData.append("address", address);
  if (qrCode) {
    formData.append("qrCode", qrCode);
  }

  const res = await axios.post(`${BASE_URL}/gas-wallets`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.wallet;
};

export const deleteLiquidationGasWallet = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/gas-wallets/${id}`, { withCredentials: true });
};

export const validateLiquidation = async (
  sourceCurrency: Currency,
  amount: number
): Promise<{ valid: boolean; error?: string }> => {
  const res = await axios.post(
    `${BASE_URL}/validate`,
    { sourceCurrency, amount },
    { withCredentials: true }
  );
  return res.data;
};

export interface RequestOtpResponse {
  success: boolean;
  expiresAt: string;
}

export interface VerifyOtpResponse {
  valid: boolean;
  token?: string;
  error?: string;
}

export const requestLiquidationOtp = async (): Promise<RequestOtpResponse> => {
  const res = await axios.post(
    `${BASE_URL}/request-otp`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

export const verifyLiquidationOtp = async (
  otp: string
): Promise<VerifyOtpResponse> => {
  const res = await axios.post(
    `${BASE_URL}/verify-otp`,
    { otp },
    { withCredentials: true }
  );
  return res.data;
};

export const createLiquidation = async (
  sourceCurrency: Currency,
  sourceAmount: number,
  targetCrypto: string,
  targetNetwork: string,
  walletProvider: string,
  walletAddress: string,
  gasFeeCurrency: Currency,
  gasFeeNetwork: string,
  verificationToken: string
): Promise<CreateLiquidationResponse> => {
  const res = await axios.post(
    BASE_URL,
    {
      sourceCurrency,
      sourceAmount,
      targetCrypto,
      targetNetwork,
      walletProvider,
      walletAddress,
      gasFeeCurrency,
      gasFeeNetwork,
      verificationToken,
    },
    { withCredentials: true }
  );
  return res.data.liquidation;
};

export const getUserLiquidations = async (): Promise<Liquidation[]> => {
  const res = await axios.get(BASE_URL, { withCredentials: true });
  return res.data.data;
};

export const getAllLiquidations = async (): Promise<LiquidationWithUser[]> => {
  const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
  return res.data.data;
};

export const approveLiquidation = async (id: string): Promise<void> => {
  await axios.get(`${BASE_URL}/${id}/approve`, { withCredentials: true });
};

export const completeLiquidation = async (id: string): Promise<void> => {
  await axios.post(`${BASE_URL}/${id}/complete`, {}, { withCredentials: true });
};

export const rejectLiquidation = async (
  id: string,
  rejectionReason: string
): Promise<void> => {
  await axios.post(
    `${BASE_URL}/${id}/reject`,
    { rejectionReason },
    { withCredentials: true }
  );
};

export const WALLET_PROVIDERS = [
  "Trust Wallet",
  "Coinbase Wallet",
  "MetaMask",
  "SafePal",
  "Exodus",
  "Atomic Wallet",
  "Ledger Live",
  "Trezor Suite",
  "Phantom",
  "Rainbow",
] as const;

export const TARGET_CRYPTOS = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "USDT", label: "Tether (USDT)" },
  { value: "SOL", label: "Solana (SOL)" },
  { value: "BNB", label: "Binance Coin (BNB)" },
  { value: "LTC", label: "Litecoin (LTC)" },
  { value: "XRP", label: "Ripple (XRP)" },
  { value: "DOGE", label: "Dogecoin (DOGE)" },
  { value: "ADA", label: "Cardano (ADA)" },
  { value: "MATIC", label: "Polygon (MATIC)" },
  { value: "AVAX", label: "Avalanche (AVAX)" },
  { value: "DOT", label: "Polkadot (DOT)" },
] as const;

export const NETWORKS = [
  { value: "ERC20", label: "Ethereum (ERC20)" },
  { value: "TRC20", label: "Tron (TRC20)" },
  { value: "BEP20", label: "BNB Chain (BEP20)" },
  { value: "SPL", label: "Solana (SPL)" },
  { value: "Bitcoin", label: "Bitcoin Network" },
  { value: "Litecoin", label: "Litecoin Network" },
  { value: "Polygon", label: "Polygon Network" },
] as const;

