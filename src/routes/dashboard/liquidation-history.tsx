import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  Filter,
  Info,
  Clock,
  CheckCircle,
  XCircle,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getUserLiquidations, type Liquidation } from "@/utils/liquidation";

export const Route = createFileRoute("/dashboard/liquidation-history")({
  component: RouteComponent,
  errorComponent: ({ error }) => {
    const errorMsg = error.message ?? "An error occurred";
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  },
  beforeLoad: async ({ context }) => {
    const { data } = await authClient.getSession(context);
    if (!data?.session || !data?.user) {
      return redirect({
        to: "/sign-in",
        params: { callbackURL: "/dashboard/liquidation-history" },
      });
    }
  },
});

function RouteComponent() {
  const [liquidations, setLiquidations] = useState<Liquidation[]>([]);
  const [filteredLiquidations, setFilteredLiquidations] = useState<
    Liquidation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchLiquidations = async () => {
    try {
      setLoading(true);
      const data = await getUserLiquidations();
      setLiquidations(data);
      setFilteredLiquidations(data);
    } catch (error) {
      toast.error("Failed to fetch liquidation history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiquidations();
  }, []);

  useEffect(() => {
    let result = liquidations;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (liq) =>
          liq.targetCrypto.toLowerCase().includes(query) ||
          liq.sourceCurrency.toLowerCase().includes(query) ||
          liq.walletProvider.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((liq) => liq.status === statusFilter);
    }

    setFilteredLiquidations(result);
  }, [searchQuery, statusFilter, liquidations]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "APPROVED":
        return <Badge className="bg-blue-500">Approved</Badge>;
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

  if (loading) {
    return (
      <div className="flex h-full min-h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg">Loading liquidation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Liquidation History</h1>
          <p className="text-muted-foreground mt-1">
            Track all your asset liquidation requests
          </p>
        </div>
        <Button onClick={fetchLiquidations} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Status Explanation Card */}
      <Card className="mb-6 border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            Understanding Liquidation Statuses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Pending</p>
                <p className="text-xs text-muted-foreground">
                  Your request is awaiting admin review
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <ThumbsUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Approved</p>
                <p className="text-xs text-muted-foreground">
                  Admin approved. Funds are being processed
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Completed</p>
                <p className="text-xs text-muted-foreground">
                  Funds sent to your wallet. Balance deducted
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Rejected</p>
                <p className="text-xs text-muted-foreground">
                  Request denied. See reason below status
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by crypto, currency, or wallet..."
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
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredLiquidations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {liquidations.length === 0
                ? "No liquidation requests yet"
                : "No liquidations match your search criteria"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-sidebar rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Gas Fee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLiquidations.map((liq) => (
                <TableRow key={liq.id}>
                  <TableCell className="text-sm">
                    {formatDate(liq.createdAt)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{liq.sourceCurrency}</span>
                  </TableCell>
                  <TableCell>
                    ${parseFloat(liq.sourceAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{liq.targetCrypto}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {liq.targetNetwork}
                  </TableCell>
                  <TableCell>
                    ${parseFloat(liq.gasFeeAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(liq.status)}
                      {liq.rejectionReason && (
                        <span className="text-xs text-red-500">
                          {liq.rejectionReason}
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredLiquidations.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing {filteredLiquidations.length} of {liquidations.length}{" "}
          liquidations
        </div>
      )}
    </div>
  );
}
