import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
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
import { getUserWallets } from "@/utils/wallets";
import { getTotalUserIndividualBalance } from "@/utils/balance";
import type { Currency, UserWallet } from "@/utils/wallets";
import { toast } from "sonner";
import { applyForWithdrawal } from "@/utils/withdrawal";

// Hook to warn user before leaving/refreshing page
function useBeforeUnload(enabled: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!enabled) return;

      e.preventDefault();
      e.returnValue =
        "You have a withdrawal in progress. Are you sure you want to leave?";
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

export const Route = createFileRoute("/dashboard/withdraw/")({
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
        params: { callbackURL: "/dashboard/withdraw" },
      });
    }
    if (!data?.user.kyc_verified) {
      return redirect({
        to: "/dashboard/account/kyc",
      });
    }
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    "select-currency" | "enter-details" | "confirmation"
  >("select-currency");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null
  );
  const [amountCrypto, setAmountCrypto] = useState<string>("");
  const [currencyBalances, setCurrencyBalances] = useState<
    Record<Currency, string>
  >({} as Record<Currency, string>);
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [availableCurrencies, setAvailableCurrencies] = useState<Currency[]>(
    []
  );

  // Prevent accidental navigation during withdrawal
  useBeforeUnload(step === "enter-details" && amountCrypto !== "");

  // Fetch user wallets and balance on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch individual user balances
        const balances = await getTotalUserIndividualBalance();
        setCurrencyBalances(balances);

        // Fetch user wallets
        const walletData = await getUserWallets();

        // If user has no wallets, keep wallets as empty array
        if (
          !walletData ||
          (Array.isArray(walletData) && walletData.length === 0)
        ) {
          setWallets([]);
        } else if (Array.isArray(walletData)) {
          setWallets(walletData);
        } else {
          setWallets([walletData]);
        }

        // Get available currencies
        // In a real app, this might come from an API
        setAvailableCurrencies(["BTC", "ETH", "USDT", "SOL", "BNB", "LTC"]);
      } catch (err) {
        setError("Failed to load withdrawal data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle currency selection
  const handleSelectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    setStep("enter-details");
  };

  // Get wallet for selected currency if exists
  const getWalletForCurrency = (currency: Currency): UserWallet | null => {
    return wallets.find((wallet) => wallet.currency === currency) || null;
  };

  // Handle withdrawal submission
  const handleWithdrawalSubmit = async () => {
    if (
      !selectedCurrency ||
      !amountCrypto ||
      isNaN(parseFloat(amountCrypto)) ||
      !destinationAddress
    ) {
      setError("Please fill all required fields");
      return;
    }

    const amountInCrypto = parseFloat(amountCrypto);
    const maxAmount = parseFloat(currencyBalances[selectedCurrency] || "0");

    if (amountInCrypto > maxAmount) {
      setError(
        `Withdrawal amount exceeds your available ${selectedCurrency} balance`
      );
      return;
    }

    try {
      setProcessingWithdrawal(true);

      await applyForWithdrawal(
        selectedCurrency,
        amountInCrypto,
        destinationAddress
      );
      setStep("confirmation");
    } catch (err) {
      setError("Failed to process your withdrawal. Please try again.");
      console.error(err);
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  // Format currency amount for display
  const formatCryptoAmount = (amount: string, currency: Currency) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "0";

    // Different precision for different currencies
    if (currency === "BTC") return numAmount.toFixed(8);
    if (currency === "ETH") return numAmount.toFixed(6);
    if (currency === "SOL" || currency === "BNB" || currency === "LTC")
      return numAmount.toFixed(4);
    return numAmount.toFixed(2); // USDT and others
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg">Loading withdrawal options...</p>
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
        <h1 className="text-3xl font-bold mb-6">Withdraw Funds</h1>

        <div className="max-w-lg mx-auto mb-8 bg-blue-50 text-black p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Your Balances</h2>
          <div className="space-y-2">
            {availableCurrencies.map((currency) => (
              <div key={currency} className="flex items-center justify-between">
                <div className="flex items-center">
                  <CurrencyIcon currency={currency} />
                  <span className="ml-2 font-medium">{currency}</span>
                </div>
                <div className="font-bold">
                  {formatCryptoAmount(
                    currencyBalances[currency] || "0",
                    currency
                  )}{" "}
                  {currency}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 mb-8 text-center">
          Select the cryptocurrency you wish to withdraw:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {availableCurrencies.map((currency) => {
            const walletExists = getWalletForCurrency(currency);
            const balance = parseFloat(currencyBalances[currency] || "0");
            const hasBalance = balance > 0;

            return (
              <Card
                key={currency}
                className={`hover:shadow-md transition-shadow ${walletExists && hasBalance ? "cursor-pointer" : "opacity-75"}`}
                onClick={() =>
                  walletExists && hasBalance && handleSelectCurrency(currency)
                }
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <CurrencyIcon currency={currency} />
                    <CardTitle>{currency}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Balance:{" "}
                    {formatCryptoAmount(
                      currencyBalances[currency] || "0",
                      currency
                    )}{" "}
                    {currency}
                  </CardDescription>
                  {walletExists ? (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      Wallet: {walletExists.address.substring(0, 10)}...
                      {walletExists.address.substring(
                        walletExists.address.length - 10
                      )}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2">
                      No {currency} wallet address added
                    </p>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  {walletExists && hasBalance ? (
                    <Button variant="ghost" className="ml-auto" size="sm">
                      Withdraw <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : !walletExists ? (
                    <Link
                      to="/dashboard/account/wallet"
                      search={{ callbackURL: "/dashboard/withdraw/" }}
                      className="ml-auto"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        Add Wallet
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      disabled
                    >
                      No Balance
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Render withdrawal details step
  if (step === "enter-details" && selectedCurrency) {
    const selectedWallet = getWalletForCurrency(selectedCurrency);
    const maxAmount = parseFloat(currencyBalances[selectedCurrency] || "0");

    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Withdraw {selectedCurrency}</h1>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CurrencyIcon currency={selectedCurrency} />
              <span className="ml-2">{selectedCurrency} Withdrawal</span>
            </CardTitle>
            <CardDescription>
              Available balance:{" "}
              {formatCryptoAmount(
                currencyBalances[selectedCurrency] || "0",
                selectedCurrency
              )}{" "}
              {selectedCurrency}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium">
                Amount to Withdraw (in {selectedCurrency})
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="w-full p-2 border rounded"
                  value={amountCrypto}
                  onChange={(e) => setAmountCrypto(e.target.value)}
                  step={selectedCurrency === "BTC" ? "0.00000001" : "0.000001"}
                  min="0"
                  max={maxAmount}
                />
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">
                  Maximum:{" "}
                  {formatCryptoAmount(
                    currencyBalances[selectedCurrency] || "0",
                    selectedCurrency
                  )}{" "}
                  {selectedCurrency}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs p-0 h-auto"
                  onClick={() => setAmountCrypto(maxAmount.toString())}
                >
                  Use Max
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                Destination Address
              </label>
              <input
                id="address"
                type="text"
                placeholder={`Enter your ${selectedCurrency} address`}
                className="w-full p-2 border rounded font-mono text-xs sm:text-sm"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
              />
              {selectedWallet && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-1"
                  onClick={() => {
                    setDestinationAddress(selectedWallet.address);
                    toast.success("Address copied from your saved wallet");
                  }}
                >
                  Use My Saved {selectedCurrency} Wallet Address
                </Button>
              )}
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
                      <li>Withdrawals are processed within 24 hours</li>
                      <li>
                        Network fees will be deducted from your withdrawal
                        amount
                      </li>
                      <li>
                        Double-check your withdrawal address - funds sent to
                        incorrect addresses cannot be recovered
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
                if (amountCrypto && parseFloat(amountCrypto) > 0) {
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
              onClick={handleWithdrawalSubmit}
              disabled={
                !amountCrypto ||
                isNaN(parseFloat(amountCrypto)) ||
                parseFloat(amountCrypto) <= 0 ||
                parseFloat(amountCrypto) > maxAmount ||
                !destinationAddress ||
                processingWithdrawal
              }
            >
              {processingWithdrawal ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Withdrawal Request"
              )}
            </Button>
          </CardFooter>
        </Card>

        <AlertDialog open={exitConfirmOpen} onOpenChange={setExitConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard Withdrawal Request?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to go back? Your withdrawal details will
                not be saved.
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
            <CardTitle className="mt-4 text-xl">
              Withdrawal Request Submitted
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your withdrawal request of{" "}
              {formatCryptoAmount(amountCrypto, selectedCurrency!)}{" "}
              {selectedCurrency} has been submitted and is pending approval.
            </p>
            <p className="text-gray-600">
              You'll receive a notification once your withdrawal has been
              processed.
            </p>
          </CardContent>

          <CardFooter className="flex justify-center space-x-4">
            <Button
              onClick={() => navigate({ to: "/dashboard/withdraw-history" })}
            >
              View Withdrawal History
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
