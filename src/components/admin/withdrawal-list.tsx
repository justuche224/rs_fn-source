import { useEffect, useState } from "react";
import { Loader2, Check, X, Search, Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  getAllWithdrawalHistory,
  approveWithdrawal,
  rejectWithdrawal,
  type Withdraw,
} from "@/utils/withdrawal";

export default function AdminWithdrawalsPage() {
  const [allWithdrawals, setAllWithdrawals] = useState<Withdraw[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<Withdraw[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdraw | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchWithdrawalsData = async () => {
    try {
      setLoading(true);
      const withdrawals = await getAllWithdrawalHistory();
      setAllWithdrawals(withdrawals);
      setFilteredWithdrawals(withdrawals);
    } catch (error) {
      toast.error("Failed to fetch withdrawals data");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search query or status filter changes
  useEffect(() => {
    let result = allWithdrawals;

    // Filter by search query (name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (withdrawal) =>
          withdrawal.user.name.toLowerCase().includes(query) ||
          withdrawal.user.email.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter(
        (withdrawal) => withdrawal.status === statusFilter
      );
    }

    setFilteredWithdrawals(result);
  }, [searchQuery, statusFilter, allWithdrawals]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveWithdrawal(id);
      toast.success("Withdrawal approved successfully");
      fetchWithdrawalsData();
    } catch (error) {
      toast.error("Failed to approve withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setProcessingId(id);
    try {
      const rejectionReason = reason.trim();
      await rejectWithdrawal(id, rejectionReason);
      toast.success("Withdrawal rejected successfully");
      fetchWithdrawalsData();
      setIsRejecting(false);
      setSelectedWithdrawal(null);
    } catch (error) {
      toast.error("Failed to reject withdrawal");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    return `${numAmount.toLocaleString(undefined, {
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

  useEffect(() => {
    fetchWithdrawalsData();
  }, []);

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Withdrawals Administration</h1>
        <Button
          onClick={fetchWithdrawalsData}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
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
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Destination Address</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWithdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {allWithdrawals.length === 0
                      ? "No withdrawals found"
                      : "No withdrawals match your search criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">
                      {withdrawal.user.name ||
                        withdrawal.user.id.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {withdrawal.user.email}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {withdrawal.destinationAddress.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(withdrawal.amount, withdrawal.currency)}
                    </TableCell>
                    <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                    <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {withdrawal.status === "PENDING" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => handleApprove(withdrawal.id)}
                              disabled={processingId === withdrawal.id}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setRejectionReason("");
                                setIsRejecting(true);
                              }}
                              disabled={processingId === withdrawal.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog
        open={!!selectedWithdrawal && isRejecting}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedWithdrawal(null);
            setIsRejecting(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Withdrawal</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this withdrawal request.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <textarea
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => {
                setSelectedWithdrawal(null);
                setIsRejecting(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                if (selectedWithdrawal) {
                  handleReject(selectedWithdrawal.id, rejectionReason);
                }
              }}
              disabled={
                !rejectionReason.trim() ||
                processingId === selectedWithdrawal?.id
              }
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
