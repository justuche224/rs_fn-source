import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getTotalUserBalance } from "@/utils/balance";
import { useNavigate } from "@tanstack/react-router";
export function WelcomeBanner() {
  const { data: session, isPending, error } = authClient.useSession();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getBalance() {
      setIsLoading(true);
      try {
        const bal = await getTotalUserBalance();
        setBalance(bal);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load balance"
        );
      } finally {
        setIsLoading(false);
      }
    }
    getBalance();
  }, []);

  if (error) {
    return null;
  }
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          Welcome back,{" "}
          {isPending ? (
            <Loader2 className="animate-spin my-auto ml-5" size={20} />
          ) : (
            session?.user.name || "User"
          )}
        </CardTitle>
        <CardDescription>
          Your portfolio is performing well. Here's a summary of your financial
          status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage ? (
          <div className="text-3xl font-bold">{errorMessage}</div>
        ) : isLoading ? (
          <div className="text-3xl font-bold">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold">
              ${new Intl.NumberFormat("en-US").format(balance)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Total balance across all accounts
            </p>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="gap-1 cursor-pointer"
          onClick={() => navigate({ to: "/dashboard/all-history" })}
        >
          View portfolio details <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
