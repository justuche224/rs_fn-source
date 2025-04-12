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

interface QuickActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function QuickActions({ className, ...props }: QuickActionsProps) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Perform common tasks with one click</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button className="w-full justify-start gap-2">
          <ArrowDownCircle className="h-4 w-4" />
          Deposit Funds
        </Button>
        <Button className="w-full justify-start gap-2">
          <CreditCard className="h-4 w-4" />
          Withdraw Funds
        </Button>
        <Button className="w-full justify-start gap-2">
          <TrendingUp className="h-4 w-4" />
          New Investment
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline">
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </CardContent>
    </Card>
  );
}
