import { CreditCard, Loader, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { getUserApprovedWithdrawals } from "@/utils/balance";
import { useEffect, useState } from "react";
import { getReferralStats, getSimpleInvestmentStats } from "@/utils/stats.ts";
import type { Currency } from "@/types";

// Define a common interface for all data states
interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string;
}

export function SummaryCards({ userId }: { userId: string }) {
  // Use a single state pattern for all data types
  const [withdrawalState, setWithdrawalState] = useState<DataState<number>>({
    data: null,
    loading: true,
    error: "",
  });

  const [referralState, setReferralState] = useState<
      DataState<{
        totalReferrals: number;
        totalRewards: string;
        currency: string;
      }>
  >({
    data: null,
    loading: true,
    error: "",
  });

  const [investmentState, setInvestmentState] = useState<
      DataState<{
        totalCount: number;
        totalInvestedAmountByCurrency: Record<Currency, string>;
        totalInvestmentAmount: number;
      }>
  >({
    data: null,
    loading: true,
    error: "",
  });

  async function getWithdrawals() {
    try {
      setWithdrawalState(prev => ({ ...prev, loading: true, error: "" }));
      const withdrawals = await getUserApprovedWithdrawals();
      const totalWithdrawals = withdrawals.reduce(
          (total, item) => total + item.totalAmount,
          0
      );
      setWithdrawalState({
        data: totalWithdrawals,
        loading: false,
        error: "",
      });
    } catch (error) {
      setWithdrawalState({
        data: null,
        loading: false,
        error: "Failed to fetch withdrawals",
      });
    }
  }

  async function getInvestments() {
    try {
      setInvestmentState(prev => ({ ...prev, loading: true, error: "" }));
      const investments = await getSimpleInvestmentStats(userId);

      // Calculate total investment amount across all currencies
      const totalInvestmentAmount = Object.values(investments.totalInvestedAmountByCurrency)
          .reduce((total, amount) => total + parseFloat(amount), 0);

      setInvestmentState({
        data: {
          ...investments,
          totalInvestmentAmount
        },
        loading: false,
        error: "",
      });
    } catch (error) {
      setInvestmentState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Error loading investment info",
      });
    }
  }

  async function getReferralInfo() {
    try {
      setReferralState(prev => ({ ...prev, loading: true, error: "" }));
      const referralInfo = await getReferralStats(userId);
      setReferralState({
        data: referralInfo,
        loading: false,
        error: "",
      });
    } catch (error) {
      setReferralState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Error loading referral info",
      });
    }
  }

  useEffect(() => {
    getWithdrawals();
    getReferralInfo();
    getInvestments();
  }, [userId]);

  return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Investments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {investmentState.loading ? (
                <div className="text-2xl font-bold">
                  <Loader className="animate-spin" />
                </div>
            ) : investmentState.error ? (
                <div className="text-sm text-red-500">{investmentState.error}</div>
            ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${investmentState.data?.totalInvestmentAmount.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">{investmentState.data?.totalCount || 0}</span> investment(s)
                  </p>
                </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawals
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {withdrawalState.loading ? (
                <div className="text-2xl font-bold">
                  <Loader className="animate-spin" />
                </div>
            ) : withdrawalState.error ? (
                <div className="text-sm text-red-500">{withdrawalState.error}</div>
            ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${withdrawalState.data?.toFixed(2) || "0.00"}
                  </div>
                </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Referral Earnings
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {referralState.loading ? (
                <div className="text-2xl font-bold">
                  <Loader className="animate-spin" />
                </div>
            ) : referralState.error ? (
                <div className="text-sm text-red-500">{referralState.error}</div>
            ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${referralState.data?.totalRewards || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">{referralState.data?.totalReferrals || 0}</span> referral(s)
                  </p>
                </>
            )}
          </CardContent>
        </Card>
      </div>
  );
}