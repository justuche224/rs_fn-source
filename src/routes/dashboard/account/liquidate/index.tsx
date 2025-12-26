import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Check,
  Copy,
  Clock,
  Zap,
  Globe,
  Shield,
  CheckCircle2,
  Mail,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { getTotalUserIndividualBalance } from "@/utils/balance";
import type { Currency, Balance } from "@/types";
import {
  getLiquidationSettings,
  getLiquidationGasWallets,
  validateLiquidation,
  createLiquidation,
  requestLiquidationOtp,
  verifyLiquidationOtp,
  WALLET_PROVIDERS,
  TARGET_CRYPTOS,
  NETWORKS,
  type LiquidationSettings,
  type LiquidationGasWallet,
  type CreateLiquidationResponse,
} from "@/utils/liquidation";

export const Route = createFileRoute("/dashboard/account/liquidate/")({
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
        params: { callbackURL: "/dashboard/account/liquidate" },
      });
    }
    if (!data?.user.kyc_verified) {
      return redirect({
        to: "/dashboard/account/kyc",
      });
    }
  },
});

type Step =
  | "select-assets"
  | "enter-amount"
  | "select-target"
  | "fee-calculation"
  | "link-wallet"
  | "verify-otp"
  | "payment"
  | "confirmation"
  | "success";

const CurrencyIcon = ({ currency }: { currency: Currency }) => {
  const colorMap: Record<string, string> = {
    BTC: "bg-orange-500",
    ETH: "bg-purple-700",
    USDT: "bg-green-600",
    SOL: "bg-blue-600",
    BNB: "bg-yellow-500",
    LTC: "bg-gray-500",
  };

  const symbolMap: Record<string, string> = {
    BTC: "₿",
    ETH: "Ξ",
    USDT: "₮",
    SOL: "◎",
    BNB: "B",
    LTC: "Ł",
  };

  return (
    <div
      className={`h-8 w-8 rounded-full ${
        colorMap[currency] || "bg-gray-400"
      } flex items-center justify-center text-white font-bold`}
    >
      {symbolMap[currency] || "?"}
    </div>
  );
};

function RouteComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<Step>("select-assets");

  const [settings, setSettings] = useState<LiquidationSettings | null>(null);
  const [gasWallets, setGasWallets] = useState<LiquidationGasWallet[]>([]);
  const [balances, setBalances] = useState<Balance | null>(null);

  const [selectedCurrencies, setSelectedCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState("");
  const [targetCrypto, setTargetCrypto] = useState("");
  const [targetNetwork, setTargetNetwork] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [gasFeeCurrency, setGasFeeCurrency] = useState<Currency | "">("");
  const [gasFeeNetwork, setGasFeeNetwork] = useState("");

  const [calculatedGasFee, setCalculatedGasFee] = useState(0);
  const [liquidationResult, setLiquidationResult] =
    useState<CreateLiquidationResponse | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(20 * 60);

  // OTP state
  const [otpValue, setOtpValue] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<Date | null>(null);
  const [otpTimeRemaining, setOtpTimeRemaining] = useState(5 * 60);
  const [, setVerificationToken] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [settingsData, walletsData, balancesData] = await Promise.all([
        getLiquidationSettings(),
        getLiquidationGasWallets(),
        getTotalUserIndividualBalance(),
      ]);
      setSettings(settingsData);
      setGasWallets(walletsData);
      setBalances(balancesData);
    } catch (error) {
      toast.error("Failed to load liquidation data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (step === "payment" && liquidationResult) {
      const expiresAt = new Date(liquidationResult.expiresAt).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeRemaining(remaining);
        if (remaining === 0) {
          clearInterval(interval);
          toast.error("Payment timer expired. Please start again.");
          setStep("select-assets");
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, liquidationResult]);

  // OTP expiry timer
  useEffect(() => {
    if (step === "verify-otp" && otpExpiresAt) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(
          0,
          Math.floor((otpExpiresAt.getTime() - now) / 1000)
        );
        setOtpTimeRemaining(remaining);
        if (remaining === 0) {
          clearInterval(interval);
          toast.error("OTP expired. Please request a new code.");
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, otpExpiresAt]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const interval = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTotalSelectedBalance = () => {
    if (!balances) return 0;
    return selectedCurrencies.reduce((total, currency) => {
      return total + parseFloat(balances[currency] || "0");
    }, 0);
  };

  const getMaxLiquidationAmount = () => {
    if (!settings?.maxLiquidationPercentage) return 0;
    return (
      (getTotalSelectedBalance() * settings.maxLiquidationPercentage) / 100
    );
  };

  const handleCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency]
    );
  };

  const handleAmountSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum > getMaxLiquidationAmount()) {
      toast.error(
        `Amount exceeds maximum allowed (${settings?.maxLiquidationPercentage}% of balance)`
      );
      return;
    }

    const sourceCurrency = selectedCurrencies[0];
    const validation = await validateLiquidation(sourceCurrency, amountNum);
    if (!validation.valid) {
      toast.error(validation.error || "Validation failed");
      return;
    }

    setStep("select-target");
  };

  const handleTargetSubmit = () => {
    if (!targetCrypto || !targetNetwork) {
      toast.error("Please select target crypto and network");
      return;
    }
    setStep("fee-calculation");
    simulateFeeCalculation();
  };

  const simulateFeeCalculation = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    await new Promise((r) => setTimeout(r, 1000));
    await new Promise((r) => setTimeout(r, 1000));

    if (settings?.gasFeePercentage) {
      const fee = (parseFloat(amount) * settings.gasFeePercentage) / 100;
      setCalculatedGasFee(fee);
    }
    setProcessing(false);
    setStep("link-wallet");
  };

  const handleWalletSubmit = async () => {
    if (!walletProvider || !walletAddress) {
      toast.error("Please select wallet provider and enter address");
      return;
    }
    if (!gasFeeCurrency || !gasFeeNetwork) {
      toast.error("Please select gas fee payment method");
      return;
    }

    const gasWallet = gasWallets.find(
      (w) => w.currency === gasFeeCurrency && w.network === gasFeeNetwork
    );
    if (!gasWallet) {
      toast.error("No gas wallet available for selected payment method");
      return;
    }

    // Request OTP and go to verification step
    await handleRequestOtp();
  };

  const handleRequestOtp = async () => {
    setOtpSending(true);
    try {
      const result = await requestLiquidationOtp();
      if (result.success) {
        setOtpExpiresAt(new Date(result.expiresAt));
        setOtpTimeRemaining(5 * 60);
        setOtpValue("");
        setResendCooldown(60); // 60 second cooldown before resend
        setStep("verify-otp");
        toast.success("Verification code sent to your email");
      }
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter a valid 6-character code");
      return;
    }

    setOtpVerifying(true);
    try {
      const result = await verifyLiquidationOtp(otpValue);
      if (result.valid && result.token) {
        setVerificationToken(result.token);
        toast.success("Verification successful!");
        setStep("payment");
        handleCreateLiquidation(result.token);
      } else {
        toast.error(result.error || "Invalid verification code");
      }
    } catch (error) {
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleCreateLiquidation = async (token: string) => {
    setProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 2000));

      const result = await createLiquidation(
        selectedCurrencies[0],
        parseFloat(amount),
        targetCrypto,
        targetNetwork,
        walletProvider,
        walletAddress,
        gasFeeCurrency as Currency,
        gasFeeNetwork,
        token
      );
      setLiquidationResult(result);
    } catch (error) {
      toast.error("Failed to create liquidation request");
      setStep("verify-otp");
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    await new Promise((r) => setTimeout(r, 1500));
    await new Promise((r) => setTimeout(r, 1000));
    setProcessing(false);
    setStep("success");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg">Loading liquidation options...</p>
        </div>
      </div>
    );
  }

  if (
    !settings?.isEnabled ||
    !settings?.maxLiquidationPercentage ||
    !settings?.gasFeePercentage
  ) {
    return (
      <div className="container py-8 mx-auto">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="mt-4">Liquidation Not Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Liquidation is not available yet. Please contact support for
              assistance.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate({ to: "/dashboard" })}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (gasWallets.length === 0) {
    return (
      <div className="container py-8 mx-auto">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="mt-4">
              Service Temporarily Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Gas fee payment addresses are not configured. Please contact
              support.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate({ to: "/dashboard" })}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "select-assets") {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Liquidate Assets</h1>
        <p className="text-muted-foreground mb-8">
          Convert your crypto holdings to your preferred cryptocurrency
        </p>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Step 1: Select Assets to Liquidate</CardTitle>
            <CardDescription>
              Choose which assets you want to liquidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {balances &&
                Object.entries(balances).map(([currency, balance]) => {
                  const balanceNum = parseFloat(balance);
                  const isSelected = selectedCurrencies.includes(
                    currency as Currency
                  );
                  return (
                    <div
                      key={currency}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      } ${
                        balanceNum <= 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        balanceNum > 0 &&
                        handleCurrencyToggle(currency as Currency)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={isSelected}
                          disabled={balanceNum <= 0}
                        />
                        <CurrencyIcon currency={currency as Currency} />
                        <div>
                          <p className="font-medium">{currency}</p>
                          <p className="text-sm text-muted-foreground">
                            Balance: ${balanceNum.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {selectedCurrencies.length > 0 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Total Selected Balance
                </p>
                <p className="text-2xl font-bold">
                  ${getTotalSelectedBalance().toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Max Liquidation ({settings.maxLiquidationPercentage}%): $
                  {getMaxLiquidationAmount().toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={() => setStep("enter-amount")}
              disabled={selectedCurrencies.length === 0}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "enter-amount") {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Liquidate Assets</h1>
        <p className="text-muted-foreground mb-8">Enter liquidation amount</p>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Step 2: Enter Amount</CardTitle>
            <CardDescription>
              Specify how much you want to liquidate (in USD)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">
                ${getTotalSelectedBalance().toFixed(2)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Liquidate (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  max={getMaxLiquidationAmount()}
                  step="0.01"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Max: ${getMaxLiquidationAmount().toFixed(2)} (
                  {settings.maxLiquidationPercentage}%)
                </span>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() =>
                    setAmount(getMaxLiquidationAmount().toFixed(2))
                  }
                >
                  Use Max
                </Button>
              </div>
            </div>

            <div className="rounded-md bg-amber-50 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    You can liquidate up to {settings.maxLiquidationPercentage}%
                    of your total balance per request.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("select-assets")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleAmountSubmit}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "select-target") {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Liquidate Assets</h1>
        <p className="text-muted-foreground mb-8">
          Select target cryptocurrency
        </p>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Step 3: Select Target Crypto & Network</CardTitle>
            <CardDescription>
              Choose which cryptocurrency you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Target Cryptocurrency</Label>
              <Select value={targetCrypto} onValueChange={setTargetCrypto}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_CRYPTOS.map((crypto) => (
                    <SelectItem key={crypto.value} value={crypto.value}>
                      {crypto.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Network</Label>
              <Select value={targetNetwork} onValueChange={setTargetNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="text-sm font-medium">Liquidation Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span>${amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target</span>
                <span>
                  {targetCrypto || "-"} ({targetNetwork || "-"})
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("enter-amount")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleTargetSubmit}
              disabled={!targetCrypto || !targetNetwork}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "fee-calculation") {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Liquidate Assets</h1>
        <p className="text-muted-foreground mb-8">Calculating fees...</p>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Step 4: Fee Calculation</CardTitle>
            <CardDescription>
              Calculating gas fees and checking network availability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Calculating gas fee...</p>
                  <div className="h-1 bg-muted-foreground/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary w-1/3 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Checking network availability...
                  </p>
                  <div className="h-1 bg-muted-foreground/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary w-2/3 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Validating transaction...
                  </p>
                  <div className="h-1 bg-muted-foreground/20 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary w-full animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center py-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we prepare your liquidation...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "link-wallet") {
    const availableGasPayments = gasWallets.reduce((acc, wallet) => {
      if (!acc[wallet.currency]) {
        acc[wallet.currency] = [];
      }
      if (!acc[wallet.currency].includes(wallet.network)) {
        acc[wallet.currency].push(wallet.network);
      }
      return acc;
    }, {} as Record<string, string[]>);

    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Liquidate Assets</h1>
        <p className="text-muted-foreground mb-8">Link your wallet</p>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Step 5: Link Wallet & Pay Gas Fee</CardTitle>
            <CardDescription>
              Connect your wallet and select gas fee payment method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-800">Gas Fee</span>
                <span className="text-lg font-bold text-green-800">
                  ${calculatedGasFee.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {settings.gasFeePercentage}% of liquidation amount
              </p>
            </div>

            <div className="space-y-2">
              <Label>Wallet Provider</Label>
              <Select value={walletProvider} onValueChange={setWalletProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet provider" />
                </SelectTrigger>
                <SelectContent>
                  {WALLET_PROVIDERS.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Your Wallet Address</Label>
              <Input
                placeholder="Enter your wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This is where your liquidated {targetCrypto} will be sent
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Gas Fee Payment Method</h4>

              <div className="space-y-2">
                <Label>Pay Gas Fee With</Label>
                <Select
                  value={gasFeeCurrency}
                  onValueChange={(v) => {
                    setGasFeeCurrency(v as Currency);
                    setGasFeeNetwork("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(availableGasPayments).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {gasFeeCurrency && (
                <div className="space-y-2 mt-4">
                  <Label>Network</Label>
                  <Select
                    value={gasFeeNetwork}
                    onValueChange={setGasFeeNetwork}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGasPayments[gasFeeCurrency]?.map((network) => (
                        <SelectItem key={network} value={network}>
                          {network}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setStep("select-target");
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleWalletSubmit}
              disabled={
                !walletProvider ||
                !walletAddress ||
                !gasFeeCurrency ||
                !gasFeeNetwork ||
                otpSending
              }
            >
              {otpSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "verify-otp") {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Liquidate Assets</h1>
        <p className="text-muted-foreground mb-8">Security verification</p>

        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Step 6: Verify Your Identity</CardTitle>
            <CardDescription>
              Enter the 6-character verification code sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OTP Timer */}
            <div
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                otpTimeRemaining <= 60
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <Clock
                className={`h-5 w-5 ${
                  otpTimeRemaining <= 60 ? "text-red-600" : "text-blue-600"
                }`}
              />
              <span
                className={`text-lg font-bold ${
                  otpTimeRemaining <= 60 ? "text-red-600" : "text-blue-600"
                }`}
              >
                {formatTime(otpTimeRemaining)}
              </span>
              <span
                className={`text-sm ${
                  otpTimeRemaining <= 60 ? "text-red-600" : "text-blue-600"
                }`}
              >
                until code expires
              </span>
            </div>

            {/* Email indicator */}
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Code sent to your email</p>
                <p className="text-xs text-muted-foreground">
                  Check your inbox and spam folder
                </p>
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-character code"
                value={otpValue}
                onChange={(e) =>
                  setOtpValue(e.target.value.toUpperCase().slice(0, 6))
                }
                className="text-center text-2xl tracking-[0.5em] font-mono uppercase"
                maxLength={6}
                autoComplete="one-time-code"
              />
              <p className="text-xs text-muted-foreground text-center">
                Enter the alphanumeric code from your email
              </p>
            </div>

            {/* Resend button */}
            <div className="text-center">
              <Button
                variant="link"
                onClick={handleRequestOtp}
                disabled={resendCooldown > 0 || otpSending}
                className="text-sm"
              >
                {otpSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend code in ${resendCooldown}s`
                ) : (
                  "Didn't receive the code? Resend"
                )}
              </Button>
            </div>

            {/* Security notice */}
            <div className="rounded-md bg-amber-50 p-4">
              <div className="flex">
                <Shield className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Security Notice
                  </h3>
                  <ul className="mt-2 text-sm text-amber-700 space-y-1">
                    <li>Never share this code with anyone</li>
                    <li>Our team will never ask for your code</li>
                    <li>Code expires in 5 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep("link-wallet")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleVerifyOtp}
              disabled={otpValue.length !== 6 || otpVerifying || otpTimeRemaining === 0}
            >
              {otpVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "payment") {
    if (processing || !liquidationResult) {
      return (
        <div className="container py-8 mx-auto">
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Generating Payment Address</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">
                Generating secure gas fee payment address...
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please do not close this page
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="container py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2">Liquidate Assets</h1>
        <p className="text-muted-foreground mb-8">Pay gas fee</p>

        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Step 7: Pay Gas Fee</CardTitle>
            <CardDescription>
              Send the gas fee to complete your liquidation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-lg font-bold text-red-600">
                {formatTime(timeRemaining)}
              </span>
              <span className="text-sm text-red-600">remaining</span>
            </div>

            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Amount to Pay</p>
              <p className="text-3xl font-bold">
                ${parseFloat(liquidationResult.gasFeeAmount).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                in {liquidationResult.gasFeeCurrency}
              </p>
            </div>

            {liquidationResult.gasFeeQrCode && (
              <div className="flex justify-center">
                <img
                  src={liquidationResult.gasFeeQrCode}
                  alt="Payment QR Code"
                  className="w-48 h-48 rounded-lg border"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Payment Address</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={liquidationResult.gasFeeAddress}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    copyToClipboard(liquidationResult.gasFeeAddress)
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md bg-amber-50 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Important
                  </h3>
                  <ul className="mt-2 text-sm text-amber-700 space-y-1">
                    <li>
                      Send exactly $
                      {parseFloat(liquidationResult.gasFeeAmount).toFixed(2)} in{" "}
                      {liquidationResult.gasFeeCurrency}
                    </li>
                    <li>Payment must be made within the time limit</li>
                    <li>Double-check the address before sending</li>
                    <li>Only send from your linked wallet</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={handlePaymentConfirmation}
              disabled={processing}
              className="w-full"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying Payment...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />I Have Made the Payment
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (step === "confirmation") {
    return (
      <div className="container py-8 mx-auto">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Verifying Payment</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">
              Verifying your payment on the blockchain...
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="container py-8 mx-auto">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-xl">
              Liquidation Request Submitted
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your liquidation request of ${amount} has been submitted and is
              being processed.
            </p>

            <div className="p-4 bg-muted rounded-lg text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span>${amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target</span>
                <span>
                  {targetCrypto} ({targetNetwork})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gas Fee Paid</span>
                <span>${calculatedGasFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-amber-600 font-medium">Processing</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              You will receive a notification once your liquidation is complete.
              You can track the status in your liquidation history.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={() => navigate({ to: "/dashboard/liquidation-history" })}
            >
              View Liquidation History
            </Button>
            <Button
              variant="outline"
              className="w-full"
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
