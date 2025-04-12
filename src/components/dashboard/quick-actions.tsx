import type React from "react";
import { ArrowDownCircle, CreditCard, Plus, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function QuickActions({ className, ...props }: QuickActionsProps) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Perform common tasks with one click</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Link to="/dashboard/deposit">
          <Button className="w-full justify-start gap-2 cursor-pointer">
            <ArrowDownCircle className="h-4 w-4" />
            Deposit Funds
          </Button>
        </Link>
        <Link to="/dashboard/withdraw">
          <Button className="w-full justify-start gap-2 cursor-pointer">
            <CreditCard className="h-4 w-4" />
            Withdraw Funds
          </Button>
        </Link>
        <Link to="/dashboard/plans">
          <Button className="w-full justify-start gap-2 cursor-pointer">
            <TrendingUp className="h-4 w-4" />
            New Investment
          </Button>
        </Link>
        <Link to="/dashboard/account/wallet">
          <Button
            className="w-full justify-start gap-2 cursor-pointer"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            Add Payment Method
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
