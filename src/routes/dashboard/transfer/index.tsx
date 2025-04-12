import { authClient } from "@/lib/auth-client";
import type { Balance, Currency } from "@/types";
import { getTotalUserIndividualBalance } from "@/utils/balance";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { internalTransfer, interUserTransfer } from "@/utils/transfers";

const makeTransfer = async (
  fromCurrency: Currency,
  toCurrency: Currency | null,
  amount: number,
  recipientEmail?: string
): Promise<{ success: boolean; message: string }> => {
  if (!recipientEmail && toCurrency) {
    const { success, error } = await internalTransfer(
      fromCurrency,
      toCurrency,
      amount
    );
    if (success) {
      return { success: true, message: "Transfer success" };
    } else {
      return { success: false, message: error ?? "Transfer failed" };
    }
  } else if (recipientEmail) {
    const { success, error } = await interUserTransfer(
      fromCurrency,
      recipientEmail,
      amount
    );
    if (success) {
      return { success: true, message: "Transfer success" };
    } else {
      return { success: false, message: error ?? "Transfer failed" };
    }
  }
  return { success: false, message: "Invalid transfer type" };
};

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

export const Route = createFileRoute("/dashboard/transfer/")({
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
        params: { callbackURL: "/dashboard/transfer" },
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
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [balances, setBalances] = useState<Balance | null>(null);
  const [transferType, setTransferType] = useState<"internal" | "external">(
    "internal"
  );

  // Form state
  const [fromCurrency, setFromCurrency] = useState<Currency | "">("");
  const [toCurrency, setToCurrency] = useState<Currency | "">("");
  const [amount, setAmount] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");

  // Confirmation states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferComplete, setTransferComplete] = useState(false);

  const getBalances = async () => {
    setLoading(true);
    try {
      const res = await getTotalUserIndividualBalance();
      setBalances(res);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalances();
  }, []);

  const handleTransfer = async () => {
    if (
      !fromCurrency ||
      !amount ||
      parseFloat(amount) <= 0 ||
      (transferType === "internal" && !toCurrency) ||
      (transferType === "external" && !recipientEmail)
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if user has enough balance
    if (
      balances &&
      parseFloat(balances[fromCurrency as Currency]) < parseFloat(amount)
    ) {
      toast.error(`Insufficient ${fromCurrency} balance`);
      return;
    }

    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    setShowConfirmation(false);
    setProcessing(true);

    try {
      const result = await makeTransfer(
        fromCurrency as Currency,
        transferType === "internal" ? (toCurrency as Currency) : null,
        parseFloat(amount),
        transferType === "external" ? recipientEmail : undefined
      );

      if (result.success) {
        // Update balances after successful transfer
        await getBalances();
        setTransferComplete(true);
      } else {
        toast.error(result.message || "Transfer failed");
      }
    } catch (e) {
      toast.error("Failed to process transfer. Please try again.");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFromCurrency("");
    setToCurrency("");
    setAmount("");
    setRecipientEmail("");
    setTransferComplete(false);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg">Loading your balances...</p>
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
            <p>{error.message}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render success confirmation
  if (transferComplete) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-xl">Transfer Complete</CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your transfer of ${amount} of {fromCurrency} has been completed
              successfully.
            </p>
            {transferType === "internal" ? (
              <p className="text-gray-600">
                Funds have been transferred from {fromCurrency} to {toCurrency}.
              </p>
            ) : (
              <p className="text-gray-600">
                Funds have been sent to {recipientEmail}.
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-center space-x-4">
            <Button onClick={resetForm}>Make Another Transfer</Button>
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

  // Main transfer form
  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Transfer Funds</h1>

      <Tabs
        defaultValue="internal"
        onValueChange={(v) => setTransferType(v as "internal" | "external")}
      >
        <TabsList className="mb-6 grid w-full grid-cols-2 max-w-md mx-auto ">
          <TabsTrigger value="internal" className="cursor-pointer">
            Between My Balances
          </TabsTrigger>
          <TabsTrigger value="external" className="cursor-pointer">
            To Another User
          </TabsTrigger>
        </TabsList>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>
              {transferType === "internal"
                ? "Transfer Between Your Balances"
                : "Transfer To Another User"}
            </CardTitle>
            <CardDescription>
              {transferType === "internal"
                ? "Move funds between your cryptocurrency balances"
                : "Send funds to another user via their email address"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Available Balances Section */}
            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Available Balances
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {balances &&
                  Object.entries(balances).map(([currency, balance]) => (
                    <div
                      key={currency}
                      className="flex items-center p-2 rounded-md border"
                    >
                      <CurrencyIcon currency={currency as Currency} />
                      <div className="ml-2">
                        <div className="font-medium text-black">{currency}</div>
                        <div className="text-sm text-gray-600">
                          ${parseFloat(balance).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* From Currency */}
            <div className="space-y-2">
              <Label htmlFor="from-currency">From Currency</Label>
              <Select
                value={fromCurrency}
                onValueChange={(value) => setFromCurrency(value as Currency)}
              >
                <SelectTrigger id="from-currency">
                  <SelectValue placeholder="Select currency to transfer from" />
                </SelectTrigger>
                <SelectContent>
                  {balances &&
                    Object.entries(balances)
                      .filter(([_, balance]) => parseFloat(balance) > 0)
                      .map(([currency]) => (
                        <SelectItem key={currency} value={currency}>
                          <div className="flex items-center">
                            <span className="mr-2">{currency}</span>
                            <span className="text-sm text-gray-600">
                              ${balances[currency as Currency]}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (in USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
              {fromCurrency && (
                <p className="text-sm text-gray-600">
                  Available: ${balances?.[fromCurrency as Currency] || "0.00"}
                </p>
              )}
            </div>

            {/* To Currency (for internal transfers) */}
            {transferType === "internal" && (
              <div className="space-y-2">
                <Label htmlFor="to-currency">To Currency</Label>
                <Select
                  value={toCurrency}
                  onValueChange={(value) => setToCurrency(value as Currency)}
                >
                  <SelectTrigger id="to-currency">
                    <SelectValue placeholder="Select currency to transfer to" />
                  </SelectTrigger>
                  <SelectContent>
                    {balances &&
                      Object.entries(balances)
                        .filter(([currency]) => currency !== fromCurrency)
                        .map(([currency]) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Recipient Email (for external transfers) */}
            {transferType === "external" && (
              <div className="space-y-2">
                <Label htmlFor="recipient-email">Recipient Email</Label>
                <Input
                  id="recipient-email"
                  type="email"
                  placeholder="user@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
            )}

            {/* Warning message */}
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
                      <li>All transfers are final and cannot be reversed</li>
                      {transferType === "external" && (
                        <li>
                          Please double-check the recipient email before
                          confirming
                        </li>
                      )}
                      <li>Transfer amounts are in USD value</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={
                processing ||
                !fromCurrency ||
                !amount ||
                parseFloat(amount) <= 0 ||
                (transferType === "internal" && !toCurrency) ||
                (transferType === "external" && !recipientEmail)
              }
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              {transferType === "internal" ? (
                <>
                  You are about to transfer ${amount} from {fromCurrency} to{" "}
                  {toCurrency}.
                </>
              ) : (
                <>
                  You are about to send ${amount} of {fromCurrency} to{" "}
                  {recipientEmail}.
                </>
              )}
              <div className="mt-2 font-semibold">
                This action cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTransfer}>
              Confirm Transfer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
