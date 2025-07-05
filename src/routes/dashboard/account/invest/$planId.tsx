import { useState, useMemo, useTransition } from "react";
import { AccentCard } from "@/components/ui/accent-card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getTotalUserIndividualBalance } from "@/utils/balance";
import { getPlanById } from "@/utils/plans";
import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import type { Currency } from "@/types";
import { createInvestment } from "@/utils/investments";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/account/invest/$planId")({
  component: RouteComponent,
  beforeLoad: async ({ params }) => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: `/dashboard/account/invest/${params.planId}` },
      });
    }
    if (!data?.user.kyc_verified) {
      return redirect({
        to: "/dashboard/account/kyc",
      });
    }
  },
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return <div>{errorMsg}</div>;
  },
  loader: async ({ params }) => {
    const plan = await getPlanById(params.planId);
    const balances = await getTotalUserIndividualBalance();
    return { plan, balances };
  },
});

function RouteComponent() {
  const { plan, balances } = Route.useLoaderData();
  const [isPending, startTransition] = useTransition();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );

  const formatDollarValue = (value: string) => {
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const isBalanceSufficient = () => {
    if (!selectedCurrency) return false;
    return parseFloat(balances[selectedCurrency]) >= plan.price;
  };

  const hasSufficientFundsAnywhere = useMemo(() => {
    return Object.values(balances).some(
      (amount) => parseFloat(amount as string) >= plan.price
    );
  }, [balances, plan.price]);

  const handleSubmit = () => {
    if (!selectedCurrency || !isBalanceSufficient()) return;
    startTransition(async () => {
      try {
        await createInvestment({
          planId: plan.id,
          currency: selectedCurrency,
        });
        toast.success("Investment submitted", {
          description: "you can check the status in the history page"
        })
        redirect({
          to: "/dashboard/investment-history",
        });
      } catch (error) {
        console.error("Error creating investment:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred while creating the investment."
        );
      }
    });
  };

  return (
    <div className="h-full flex flex-col items-center mt-10 w-full">
      <AccentCard
        title={plan.type}
        description={plan.description}
        footer={
          <div className="flex flex-col items-center gap-2 w-full">
            {selectedCurrency && !isBalanceSufficient() && (
              <div className="text-red-500 text-sm space-y-2 w-full">
                <p>
                  Insufficient balance. You need ${plan.price} in your{" "}
                  {selectedCurrency} account.
                </p>
                <div className="flex gap-2 w-full">
                  <Link to="/dashboard/deposit" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Deposit Funds
                    </Button>
                  </Link>

                  {hasSufficientFundsAnywhere && (
                    <Link to="/dashboard/transfer" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Transfer Funds
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              className="cursor-pointer w-full"
              disabled={
                !selectedCurrency || !isBalanceSufficient() || isPending
              }
            >
              {selectedCurrency
                ? `Invest $${plan.price} from ${selectedCurrency} account`
                : "Select an account"}
              {isPending && <Loader2 className="mr-2 animate-spin" />}
            </Button>
          </div>
        }
        footerClassName="w-full"
        className="max-w-2xl w-sm mx-auto"
      >
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-3xl font-bold">${plan.price}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>ROI Range:</span>
              <span className="font-medium">
                ${plan.minRoiAmount} - ${plan.maxRoiAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Commission:</span>
              <span className="font-medium">{plan.commission}%</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">{plan.percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">{plan.duration} months</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">
              Select account to invest with:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(balances).map(([currency, amount]) => (
                <div
                  key={currency}
                  onClick={() => setSelectedCurrency(currency as Currency)}
                  className={`
                    p-3 border rounded-lg cursor-pointer transition-colors
                    ${
                      selectedCurrency === currency
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{currency}</span>
                    <span
                      className={
                        parseFloat(amount as string) >= plan.price
                          ? "text-green-600"
                          : ""
                      }
                    >
                      {formatDollarValue(amount as string)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AccentCard>
    </div>
  );
}
