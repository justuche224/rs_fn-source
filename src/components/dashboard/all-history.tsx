import { useEffect, useState } from "react";
import {
  Loader2,
  Filter,
  FileDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

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
import { getUserTransactionHistory } from "@/utils/stats";
import type { UserTrxHistory } from "@/utils/stats";
import type { Currency } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UserTransactionsProps {
  userId: string;
}

export default function UserTransactions({ userId }: UserTransactionsProps) {
  const [transactions, setTransactions] = useState<
    UserTrxHistory["transactions"]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    UserTrxHistory["transactions"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      const data = await getUserTransactionHistory(userId);
      setTransactions(data.transactions);
      setFilteredTransactions(data.transactions);
      setTotal(data.total);
    } catch (error) {
      toast.error("Failed to fetch transaction history");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = transactions;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter(
        (transaction) => transaction.status === statusFilter
      );
    }

    // Filter by transaction type
    if (typeFilter !== "ALL") {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, typeFilter, transactions]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: string, currency: Currency) => {
    const numAmount = parseFloat(amount);
    return `${numAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })} ${currency}`;
  };

  const getStatusBadge = (status: string, type: string) => {
    // For investment-specific statuses
    if (type === "investment") {
      switch (status) {
        case "ACTIVE":
          return <Badge className="bg-green-500">Active</Badge>;
        case "COMPLETED":
          return <Badge className="bg-blue-500">Completed</Badge>;
        case "CANCELLED":
          return <Badge variant="destructive">Cancelled</Badge>;
        case "PENDING":
          return (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Pending
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Pending
            </Badge>
          );
      }
    }

    // For deposits and withdrawals
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

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case "investment":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const exportToCSV = () => {
    // Create CSV string
    const headers = ["Date", "Type", "Amount", "Currency", "Status"];
    const csvRows = [headers];

    filteredTransactions.forEach((trx) => {
      csvRows.push([
        new Date(trx.createdAt).toLocaleString(),
        trx.type,
        trx.amount,
        trx.currency,
        trx.status,
      ]);
    });

    const csvString = csvRows.map((row) => row.join(",")).join("\n");

    // Create and download the file
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${userId}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Transaction history exported successfully");
  };

  // Get dynamic status options based on selected type
  const getStatusOptions = () => {
    if (typeFilter === "investment") {
      return (
        <>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </>
      );
    } else {
      return (
        <>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="APPROVED">Approved</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </>
      );
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransactionData();
    }
  }, [userId]);

  return (
    <div className="mx-5 lg:mx-10">
      <div className="bg-sidebar rounded-lg shadow p-6 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex gap-3">
            <Button
              onClick={fetchTransactionData}
              variant="outline"
              disabled={loading}
              className="cursor-pointer"
            >
              {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              <span>
                <RefreshCw className="h-4 w-4 mr-2 md:hidden" />
              </span>
              <span className="hidden md:inline">Refresh</span>
            </Button>
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="cursor-pointer"
              disabled={filteredTransactions.length === 0}
            >
              <FileDown className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {total} transactions
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-col lg:flex-row">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="investment">Investments</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>{getStatusOptions()}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin" size={40} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        {transactions.length === 0
                          ? "No transactions found"
                          : "No transactions match your filter criteria"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransactionTypeIcon(transaction.type)}
                            <span className="capitalize">
                              {transaction.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status, transaction.type)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {filteredTransactions.length > itemsPerPage && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageToShow}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageToShow)}
                          isActive={currentPage === pageToShow}
                          className="cursor-pointer"
                        >
                          {pageToShow}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}
