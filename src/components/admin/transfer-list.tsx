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
  getAllTransfers,
  approveTransfer,
  rejectTransfer,
} from "@/utils/transfers";
import type { AdminTransfer } from "@/utils/transfers";
import type { Currency } from "@/types";

export default function AdminTransfersPage() {
  const [allTransfers, setAllTransfers] = useState<AdminTransfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<AdminTransfer[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] =
    useState<AdminTransfer | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const fetchTransfersData = async () => {
    try {
      setLoading(true);
      const response = await getAllTransfers();
      if (response.success && response.data) {
        setAllTransfers(response.data);
        setFilteredTransfers(response.data);
      } else {
        toast.error(response.error || "Failed to fetch transfers data");
      }
    } catch (error) {
      toast.error("Failed to fetch transfers data");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search query, status filter, or type filter changes
  useEffect(() => {
    let result = allTransfers;

    // Filter by search query (sender name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (transfer) =>
          transfer.sender.name.toLowerCase().includes(query) ||
          transfer.sender.email.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((transfer) => transfer.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "ALL") {
      result = result.filter((transfer) => transfer.type === typeFilter);
    }

    setFilteredTransfers(result);
  }, [searchQuery, statusFilter, typeFilter, allTransfers]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await approveTransfer(id);
      if (response.success) {
        toast.success("Transfer approved successfully");
        fetchTransfersData();
      } else {
        toast.error(response.error || "Failed to approve transfer");
      }
    } catch (error) {
      toast.error("Failed to approve transfer");
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
      const response = await rejectTransfer(id, reason);
      if (response.success) {
        toast.success("Transfer rejected successfully");
        fetchTransfersData();
        setIsRejecting(false);
        setSelectedTransfer(null);
      } else {
        toast.error(response.error || "Failed to reject transfer");
      }
    } catch (error) {
      toast.error("Failed to reject transfer");
    } finally {
      setProcessingId(null);
    }
  };

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
            Inter-User
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
        <h1 className="text-2xl font-bold">Transfers Administration</h1>
        <Button
          onClick={fetchTransfersData}
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
        <div className="flex items-center gap-2 flex-wrap">
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
                <SelectItem value="INTER_USER">Inter-User</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                <TableHead>Sender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    {allTransfers.length === 0
                      ? "No transfers found"
                      : "No transfers match your search criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">
                      {transfer.sender.name ||
                        transfer.sender.id.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transfer.sender.email}
                    </TableCell>
                    <TableCell>{getTransferType(transfer.type)}</TableCell>
                    <TableCell>{transfer.fromCurrency}</TableCell>
                    <TableCell>{transfer.toCurrency}</TableCell>
                    <TableCell>
                      {formatAmount(transfer.amount, transfer.fromCurrency)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell>{formatDate(transfer.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {transfer.status === "PENDING" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => handleApprove(transfer.id)}
                              disabled={processingId === transfer.id}
                            >
                              {processingId === transfer.id ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Check className="h-4 w-4 mr-1" />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedTransfer(transfer);
                                setRejectionReason("");
                                setIsRejecting(true);
                              }}
                              disabled={processingId === transfer.id}
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
        open={!!selectedTransfer && isRejecting}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransfer(null);
            setIsRejecting(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this transfer.
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
                setSelectedTransfer(null);
                setIsRejecting(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                if (selectedTransfer) {
                  handleReject(selectedTransfer.id, rejectionReason);
                }
              }}
              disabled={
                !rejectionReason.trim() || processingId === selectedTransfer?.id
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
