import { useEffect, useState } from "react";
import type { Currency } from "@/types";
import {
  Loader2,
  //  Check,
  //  X,
  Search,
  Filter,
  // CheckCircle, 
  // XCircle 
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  getAllInvestments,
  updateInvestmentStatus,
} from "@/utils/investments"; // Import investment utils

// Define the shape of the data returned by getAllInvestments
interface AdminInvestment {
  id: string;
  userId: string;
  planId: string;
  currency: Currency;
  amount: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  userName: string; // Included from the backend for admin view
  userEmail: string; // Included from the backend for admin view
  planType: string; // Included from the backend for admin view
}

type InvestmentStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export default function AdminInvestmentsPage() {
  const [allInvestments, setAllInvestments] = useState<AdminInvestment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<AdminInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestment, setSelectedInvestment] = useState<AdminInvestment | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isStatusUpdateDialogOpen, setIsStatusUpdateDialogOpen] = useState(false);
  const [statusUpdateAction, setStatusUpdateAction] = useState<InvestmentStatus | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchInvestmentsData = async () => {
    try {
      setLoading(true);
      const investments = await getAllInvestments();
      setAllInvestments(investments);
      setFilteredInvestments(investments); // Initialize filtered list
    } catch (error) {
      console.error("Failed to fetch investments:", error);
      toast.error("Failed to fetch investments data");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search query or status filter changes
  useEffect(() => {
    let result = allInvestments;

    // Filter by search query (name or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (investment) =>
          investment.userName.toLowerCase().includes(query) ||
          investment.userEmail.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      result = result.filter((investment) => investment.status === statusFilter);
    }

    setFilteredInvestments(result);
  }, [searchQuery, statusFilter, allInvestments]);

  // Fetch data on component mount
  useEffect(() => {
    fetchInvestmentsData();
  }, []);

  const handleStatusUpdateConfirm = async () => {
    if (!selectedInvestment || !statusUpdateAction) return;

    setProcessingId(selectedInvestment.id);
    try {
      await updateInvestmentStatus({
        investmentId: selectedInvestment.id,
        status: statusUpdateAction,
      });
      toast.success(`Investment status updated to ${statusUpdateAction}`);
      fetchInvestmentsData(); // Refresh data
      closeStatusUpdateDialog();
    } catch (error) {
      console.error(`Failed to update investment status:`, error);
      toast.error(`Failed to update investment status to ${statusUpdateAction}`);
    } finally {
      setProcessingId(null);
    }
  };

  // const openStatusUpdateDialog = (investment: AdminInvestment, action: InvestmentStatus) => {
  //   setSelectedInvestment(investment);
  //   setStatusUpdateAction(action);
  //   setIsStatusUpdateDialogOpen(true);
  // };

  const closeStatusUpdateDialog = () => {
    setSelectedInvestment(null);
    setStatusUpdateAction(null);
    setIsStatusUpdateDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number, currency: Currency) => {
    return `${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })} ${currency}`;
  };

  const getStatusBadge = (status: InvestmentStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "PENDING":
      default:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investments Administration</h1>
        <Button
          onClick={fetchInvestmentsData}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user name or email"
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
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <div className="bg-sidebar rounded-lg shadow overflow-hidden border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvestments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {allInvestments.length === 0
                      ? "No investments found"
                      : "No investments match your filter criteria"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">
                      {investment.userName || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {investment.userEmail}
                    </TableCell>
                    <TableCell className="text-sm">
                      {investment.planType}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(investment.amount, investment.currency)}
                    </TableCell>
                    <TableCell>{getStatusBadge(investment.status)}</TableCell>
                    <TableCell>{formatDate(investment.createdAt)}</TableCell>
                    {/* <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {investment.status === "PENDING" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => openStatusUpdateDialog(investment, "ACTIVE")}
                              disabled={processingId === investment.id}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Activate
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => openStatusUpdateDialog(investment, "CANCELLED")}
                              disabled={processingId === investment.id}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {investment.status === "ACTIVE" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                              onClick={() => openStatusUpdateDialog(investment, "COMPLETED")}
                              disabled={processingId === investment.id}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => openStatusUpdateDialog(investment, "CANCELLED")}
                              disabled={processingId === investment.id}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {(investment.status === "COMPLETED" || investment.status === "CANCELLED") && (
                           <span className="text-xs text-muted-foreground italic pr-4">No actions</span>
                        )}
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Status Update Confirmation Dialog */}
      <Dialog open={isStatusUpdateDialogOpen} onOpenChange={setIsStatusUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of this investment?
            </DialogDescription>
          </DialogHeader>

          {selectedInvestment && (
            <div className="my-4 space-y-2 text-sm">
              <p><strong>User:</strong> {selectedInvestment.userName} ({selectedInvestment.userEmail})</p>
              <p><strong>Plan:</strong> {selectedInvestment.planType}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedInvestment.amount, selectedInvestment.currency)}</p>
              <p><strong>Current Status:</strong> {getStatusBadge(selectedInvestment.status)}</p>
              <p><strong>New Status:</strong> {statusUpdateAction && getStatusBadge(statusUpdateAction)}</p>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeStatusUpdateDialog}
              disabled={!!processingId}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant={statusUpdateAction === 'CANCELLED' ? 'destructive' : 'default'}
              onClick={handleStatusUpdateConfirm}
              disabled={!selectedInvestment || !statusUpdateAction || processingId === selectedInvestment?.id}
              className="cursor-pointer"
            >
              {processingId === selectedInvestment?.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm {statusUpdateAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}