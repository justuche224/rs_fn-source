import axios from "axios";

export interface Referral {
  id: string;
  referrerId: string;
  referreeId: string;
  createdAt: Date;
}

export interface Stats {
  totalReferrals: number;
  totalRewards: string;
  currency: string;
}

export const getReferrals = async (): Promise<Referral[]> => {
  const ref = await axios.get("http://localhost:5000/api/referrals", {
    withCredentials: true,
  });
  return ref.data.data;
};
export const getReferralStata = async (): Promise<Stats> => {
  const ref = await axios.get(
    "http://localhost:5000/api/referrals/stats",
    {
      withCredentials: true,
    }
  );
  return ref.data.data;
};
