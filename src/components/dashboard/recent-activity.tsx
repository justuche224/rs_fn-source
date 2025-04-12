import {
  ArrowDownCircle,
  ArrowUpCircle,
  LineChart,
  Loader,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { getUserTransactionHistory, type UserTrxHistory } from "@/utils/stats";
import { authClient } from "@/lib/auth-client";

export function RecentActivity() {
  const { data: session, isPending, error } = authClient.useSession();
  const [transactions, setTransactions] = useState<UserTrxHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  async function fetchTransactionHistory(userId: string) {
    try {
      setIsLoading(true);
      const trxHistory = await getUserTransactionHistory(userId);
      setTransactions(trxHistory);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isPending || error || !session) return;
    fetchTransactionHistory(session.user.id);
  }, [session, isPending, error]);

  // Function to format dates
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }

    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }

    // Otherwise return formatted date
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  // Function to get description based on transaction type
  const getDescription = (transaction: any) => {
    switch (transaction.type) {
      case "deposit":
        return `Deposit (${transaction.currency})`;
      case "withdrawal":
        return `Withdrawal (${transaction.currency})`;
      case "investment":
        return `Investment (${transaction.currency})`;
      default:
        return `Transaction (${transaction.currency})`;
    }
  };

  // Function to filter transactions
  const filteredTransactions = transactions?.transactions.filter(
    (transaction) => {
      if (filter === "All") return true;
      return transaction.type.toLowerCase() === filter.toLowerCase();
    }
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest transactions and updates
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Deposit")}>
              Deposits
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Withdrawal")}>
              Withdrawals
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Investment")}>
              Investments
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center text-muted-foreground grid place-content-center">
            <Loader className="animate-spin" size={50} />
          </div>
        ) : !transactions || transactions.transactions.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            No transaction history found
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`rounded-full p-2 ${
                      transaction.type === "deposit"
                        ? "bg-primary/10"
                        : transaction.type === "withdrawal"
                          ? "bg-destructive/10"
                          : "bg-primary/10"
                    }`}
                  >
                    {transaction.type === "deposit" ? (
                      <ArrowDownCircle className="h-4 w-4 text-primary" />
                    ) : transaction.type === "withdrawal" ? (
                      <ArrowUpCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <LineChart className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getDescription(transaction)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Status: {transaction.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      transaction.type === "withdrawal"
                        ? "text-destructive"
                        : ""
                    }`}
                  >
                    {transaction.type === "withdrawal" ? "-" : "+"}
                    {parseFloat(transaction.amount).toLocaleString()}{" "}
                    {transaction.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
