import { useEffect, useState } from "react";
import { Loader2, ExternalLink, Filter, TrendingUp } from "lucide-react";

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
import { getUserInvestments, getUserInvestmentById } from "@/utils/investments";
import type { Investment } from "@/utils/investments";
import { Link } from "@tanstack/react-router";

export default function UserInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchInvestmentsData = async () => {
    try {
      setLoading(true);
      const userInvestments = await getUserInvestments();
      setInvestments(userInvestments);
      setFilteredInvestments(userInvestments);
    } catch (error) {
      toast.error("Failed to fetch your investment history");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever status filter changes
  useEffect(() => {
    let result = investments;

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter(
        (investment) => investment.status === statusFilter
      );
    }

    setFilteredInvestments(result);
  }, [statusFilter, investments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-500">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
    }
  };

  useEffect(() => {
    fetchInvestmentsData();
  }, []);

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Investments</h1>
        <div className="flex gap-3">
          <Button
            onClick={fetchInvestmentsData}
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
            <Link to="/dashboard/plans">
              <TrendingUp className="h-4 w-4 mr-2" />
              Invest Now
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
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {investments.length === 0
                      ? "No investments found"
                      : "No investments match your filter criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell>{formatDate(investment.createdAt)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {investment.planId.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(investment.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(investment.status)}
                      {investment.status === "ACTIVE" && (
                        <div className="text-xs text-green-500 mt-1"></div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          toast.promise(getUserInvestmentById(investment.id), {
                            loading: "Loading investment details...",
                            success: () => "Investment details loaded",
                            error: "Failed to load investment details",
                          });
                        }}
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
