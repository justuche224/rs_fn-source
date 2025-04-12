import { useEffect, useState } from "react";
import { Loader2, Plus, ExternalLink, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getDeposits } from "@/utils/deposits";
import type { Currency } from "@/types";
import { Link } from "@tanstack/react-router";

interface UserDeposit {
  id: string;
  userId: string;
  systemWalletId: string;
  currency: Currency;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FAILED";
  rejectionReason: string | null;
  approvedAt: string;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UserDepositsPage() {
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<UserDeposit[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchDepositsData = async () => {
    try {
      setLoading(true);
      const userDeposits = await getDeposits();
      setDeposits(userDeposits);
      setFilteredDeposits(userDeposits);
    } catch (error) {
      toast.error("Failed to fetch your deposit history");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever status filter changes
  useEffect(() => {
    let result = deposits;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((deposit) => deposit.status === statusFilter);
    }

    setFilteredDeposits(result);
  }, [statusFilter, deposits]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })} ${currency}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "FAILED":
        return <Badge className="bg-gray-500">Failed</Badge>;
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
    }
  };

  useEffect(() => {
    fetchDepositsData();
  }, []);

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Deposits</h1>
        <div className="flex gap-3">
          <Button
            onClick={fetchDepositsData}
            variant="outline"
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button
            asChild
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            <Link to="/dashboard/deposit">
              <Plus className="h-4 w-4 mr-2" />
              Make Deposit
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex items-center justify-end gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <div className="bg-sidebar rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Wallet ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeposits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    {deposits.length === 0
                      ? "No deposits found"
                      : "No deposits match your filter criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{formatDate(deposit.createdAt)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {deposit.systemWalletId.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(deposit.amount, deposit.currency)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(deposit.status)}
                      {deposit.rejectionReason && (
                        <div className="text-xs text-red-500 mt-1">
                          Reason: {deposit.rejectionReason}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-blue-500"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
