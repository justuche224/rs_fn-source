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
import { getUserTransfers, type UserTransfer } from "@/utils/transfers";
import type { Currency } from "@/types";
import { Link } from "@tanstack/react-router";

export default function UserTransfersPage() {
  const [transfers, setTransfers] = useState<UserTransfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<UserTransfer[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const fetchTransfersData = async () => {
    try {
      setLoading(true);
      const response = await getUserTransfers();
      if (response.success && response.data) {
        setTransfers(response.data);
        setFilteredTransfers(response.data);
      } else {
        toast.error(response.error || "Failed to fetch your transfer history");
      }
    } catch (error) {
      toast.error("Failed to fetch your transfer history");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever status or type filter changes
  useEffect(() => {
    let result = transfers;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((transfer) => transfer.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "ALL") {
      result = result.filter((transfer) => transfer.type === typeFilter);
    }

    setFilteredTransfers(result);
  }, [statusFilter, typeFilter, transfers]);

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: string, currency: Currency) => {
    return `${parseFloat(amount).toLocaleString(undefined, {
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
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
    }
  };

  const getTransferType = (type: string) => {
    switch (type) {
      case "INTERNAL":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Internal
          </Badge>
        );
      case "INTER_USER":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Sent
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {type}
          </Badge>
        );
    }
  };

  useEffect(() => {
    fetchTransfersData();
  }, []);

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Transfers</h1>
        <div className="flex gap-3">
          <Button
            onClick={fetchTransfersData}
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
            <Link to="/dashboard/transfer">
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
        <div className="flex items-center gap-2">
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
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INTERNAL">Internal</SelectItem>
              <SelectItem value="INTER_USER">Sent</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {transfers.length === 0
                      ? "No transfers found"
                      : "No transfers match your filter criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell>{formatDate(transfer.createdAt)}</TableCell>
                    <TableCell>{getTransferType(transfer.type)}</TableCell>
                    <TableCell>{transfer.fromCurrency}</TableCell>
                    <TableCell>{transfer.toCurrency}</TableCell>
                    <TableCell className="font-medium">
                      {formatAmount(transfer.amount, transfer.fromCurrency)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transfer.status)}
                      {transfer.rejectionReason && (
                        <div className="text-xs text-red-500 mt-1">
                          Reason: {transfer.rejectionReason}
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
