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
  getAllDeposits,
  approveDeposit,
  rejectDeposit,
  failDeposit,
} from "@/utils/deposits";

interface Deposit {
  id: string;
  userId: string;
  systemWalletId: string;
  currency: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "FAILED";
  rejectionReason: string | null;
  approvedAt: string;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminDepositsPage() {
  const [allDeposits, setAllDeposits] = useState<Deposit[]>([]);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isFailing, setIsFailing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchDepositsData = async () => {
    try {
      setLoading(true);
      const deposits = await getAllDeposits();
      setAllDeposits(deposits);
      setFilteredDeposits(deposits);
    } catch (error) {
      toast.error("Failed to fetch deposits data");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search query or status filter changes
  useEffect(() => {
    let result = allDeposits;

    // Filter by search query (name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (deposit) =>
          deposit.user.name.toLowerCase().includes(query) ||
          deposit.user.email.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((deposit) => deposit.status === statusFilter);
    }

    setFilteredDeposits(result);
  }, [searchQuery, statusFilter, allDeposits]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveDeposit(id);
      toast.success("Deposit approved successfully");
      fetchDepositsData();
    } catch (error) {
      toast.error("Failed to approve deposit");
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
      // Note: The rejectDeposit function would need to be updated to accept a reason
      await rejectDeposit(id, reason);
      toast.success("Deposit rejected successfully");
      fetchDepositsData();
      setIsRejecting(false);
      setSelectedDeposit(null);
    } catch (error) {
      toast.error("Failed to reject deposit");
    } finally {
      setProcessingId(null);
    }
  };

  const handleFail = async (id: string) => {
    setProcessingId(id);
    try {
      await failDeposit(id);
      toast.success("Deposit marked as failed");
      fetchDepositsData();
      setIsFailing(false);
      setSelectedDeposit(null);
    } catch (error) {
      toast.error("Failed to mark deposit as failed");
    } finally {
      setProcessingId(null);
    }
  };

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
        <h1 className="text-2xl font-bold">Deposits Administration</h1>
        <Button
          onClick={fetchDepositsData}
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
              <SelectItem value="FAILED">Failed</SelectItem>
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
                <TableHead>Wallet ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeposits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    {allDeposits.length === 0
                      ? "No deposits found"
                      : "No deposits match your search criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="font-medium">
                      {deposit.user.name ||
                        deposit.user.id.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {deposit.user.email}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {deposit.systemWalletId.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(deposit.amount, deposit.currency)}
                    </TableCell>
                    <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                    <TableCell>{formatDate(deposit.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {deposit.status === "PENDING" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => handleApprove(deposit.id)}
                              disabled={processingId === deposit.id}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedDeposit(deposit);
                                setRejectionReason("");
                                setIsRejecting(true);
                              }}
                              disabled={processingId === deposit.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer text-orange-500 border-orange-500 hover:bg-orange-50"
                              onClick={() => {
                                setSelectedDeposit(deposit);
                                setIsFailing(true);
                              }}
                              disabled={processingId === deposit.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Mark Failed
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
        open={!!selectedDeposit && isRejecting}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDeposit(null);
            setIsRejecting(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Deposit</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this deposit.
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
                setSelectedDeposit(null);
                setIsRejecting(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                if (selectedDeposit) {
                  handleReject(selectedDeposit.id, rejectionReason);
                }
              }}
              disabled={
                !rejectionReason.trim() || processingId === selectedDeposit?.id
              }
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Failure Confirmation Dialog */}
      <Dialog
        open={!!selectedDeposit && isFailing}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDeposit(null);
            setIsFailing(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Deposit as Failed</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this deposit as failed? This action
              indicates a technical or processing issue with the deposit.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => {
                setSelectedDeposit(null);
                setIsFailing(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="secondary"
              onClick={() => {
                if (selectedDeposit) {
                  handleFail(selectedDeposit.id);
                }
              }}
              disabled={processingId === selectedDeposit?.id}
            >
              Confirm Failure
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
