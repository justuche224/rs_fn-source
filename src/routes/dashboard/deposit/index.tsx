import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowRight, AlertTriangle, Check } from "lucide-react";
import { getSystemWallets } from "@/utils/wallets";
import { makeDeposit } from "@/utils/deposits";
import type { SystemWallet, Currency } from "@/utils/wallets";
import { toast } from "sonner";

// Hook to warn user before leaving/refreshing page
function useBeforeUnload(enabled: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabled) return;

      e.preventDefault();
      e.returnValue =
        "You have a deposit in progress. Are you sure you want to leave?";
      return e.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);
}

// Available currency icons
const CurrencyIcon = ({ currency }: { currency: Currency }) => {
  switch (currency) {
    case "BTC":
      return (
        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
          ₿
        </div>
      );
    case "ETH":
      return (
        <div className="h-8 w-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold">
          Ξ
        </div>
      );
    case "USDT":
      return (
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
          ₮
        </div>
      );
    case "SOL":
      return (
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          ◎
        </div>
      );
    case "BNB":
      return (
        <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
          B
        </div>
      );
    case "LTC":
      return (
        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
          Ł
        </div>
      );
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
          ?
        </div>
      );
  }
};

export const Route = createFileRoute("/dashboard/deposit/")({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  },
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session || !data?.user) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/dashboard/deposit" },
      });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<SystemWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    "select-currency" | "show-address" | "confirmation"
  >("select-currency");
  const [selectedWallet, setSelectedWallet] = useState<SystemWallet | null>(
    null
  );
  const [amount, setAmount] = useState<string>("");
  const [processingDeposit, setProcessingDeposit] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  // Prevent accidental navigation during deposit
  useBeforeUnload(step === "show-address");

  // Fetch available system wallets on component mount
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const data = await getSystemWallets();
        setWallets(data);
      } catch (err) {
        setError("Failed to load deposit methods. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  // Group wallets by currency
  const walletsByCurrency = wallets.reduce(
    (acc, wallet) => {
      if (!acc[wallet.currency]) {
        acc[wallet.currency] = [];
      }
      acc[wallet.currency].push(wallet);
      return acc;
    },
    {} as Record<Currency, SystemWallet[]>
  );

  // Handle wallet selection
  const handleSelectCurrency = (currency: Currency) => {
    const walletsForCurrency = walletsByCurrency[currency];
    if (walletsForCurrency && walletsForCurrency.length > 0) {
      // Select the first wallet for this currency
      setSelectedWallet(walletsForCurrency[0]);
      setStep("show-address");
    }
  };

  // Handle completed deposit
  const handleDepositComplete = async () => {
    if (!selectedWallet || !amount || isNaN(parseFloat(amount))) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setProcessingDeposit(true);
      await makeDeposit(
        selectedWallet.id,
        selectedWallet.currency,
        parseFloat(amount)
      );
      setStep("confirmation");
    } catch (err) {
      setError("Failed to process your deposit. Please try again.");
      console.error(err);
    } finally {
      setProcessingDeposit(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg">Loading deposit options...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="bg-red-50 text-red-700">
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render currency selection step
  if (step === "select-currency") {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Deposit Funds</h1>
        <p className="text-gray-600 mb-8">
          Select the cryptocurrency you wish to deposit:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(walletsByCurrency).map((currency) => (
            <Card
              key={currency}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSelectCurrency(currency as Currency)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CurrencyIcon currency={currency as Currency} />
                  <CardTitle>{currency}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Deposit {currency} to your account
                </CardDescription>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="ml-auto" size="sm">
                  Select <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render wallet address step
  if (step === "show-address" && selectedWallet) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Deposit {selectedWallet.currency}
        </h1>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CurrencyIcon currency={selectedWallet.currency} />
              <span className="ml-2">{selectedWallet.currency} Deposit</span>
            </CardTitle>
            <CardDescription>Send funds to the address below</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
              {selectedWallet.qrCode && (
                <div className="mb-4 p-2 bg-white rounded">
                  <img
                    src={selectedWallet.qrCode}
                    alt={`${selectedWallet.currency} QR Code`}
                    className="w-48 h-48"
                  />
                </div>
              )}

              <div className="flex items-center w-full">
                <input
                  type="text"
                  value={selectedWallet.address}
                  readOnly
                  className="w-full p-2 border rounded bg-sidebar text-xs sm:text-sm font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedWallet.address);
                    toast.success("Address copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium">
                Amount Sent in dollars
              </label>
              <input
                id="amount"
                type="number"
                placeholder={`Enter amount in dollars`}
                className="w-full p-2 border rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.00000001"
                min="0"
              />
            </div>

            <div className="rounded-md bg-amber-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Important Notes
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <ul className="list-disc space-y-1 pl-5">
                      <li>
                        Send only {selectedWallet.currency} to this address
                      </li>
                      <li>Minimum confirmation required: 1 block</li>
                      <li>
                        Please do not refresh or close this page until
                        completion
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (amount && parseFloat(amount) > 0) {
                  setExitConfirmOpen(true);
                } else {
                  setStep("select-currency");
                }
              }}
            >
              Back
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleDepositComplete}
              disabled={
                !amount ||
                isNaN(parseFloat(amount)) ||
                parseFloat(amount) <= 0 ||
                processingDeposit
              }
            >
              {processingDeposit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "I have Sent the Funds"
              )}
            </Button>
          </CardFooter>
        </Card>

        <AlertDialog open={exitConfirmOpen} onOpenChange={setExitConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you've already sent funds, going back will not cancel your
                deposit. Do you want to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setExitConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setExitConfirmOpen(false);
                  setStep("select-currency");
                }}
              >
                Yes, Go Back
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Render confirmation step
  if (step === "confirmation") {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-xl">Deposit Submitted</CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your deposit of {amount} {selectedWallet?.currency} has been
              submitted and is pending approval.
            </p>
            <p className="text-gray-600">
              Your balance will be updated as soon as the deposit is approved.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center space-x-4">
            <Button
              onClick={() => navigate({ to: "/dashboard/deposit-history" })}
            >
              View Deposit History
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return null;
}
