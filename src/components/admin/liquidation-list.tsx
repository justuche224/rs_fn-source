import { useEffect, useState } from "react";
import {
  Loader2,
  Check,
  X,
  Search,
  Filter,
  Plus,
  Trash2,
  Settings,
  Wallet,
  Info,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Currency } from "@/types";
import {
  getLiquidationSettings,
  updateLiquidationSettings,
  getLiquidationGasWallets,
  createLiquidationGasWallet,
  deleteLiquidationGasWallet,
  getAllLiquidations,
  approveLiquidation,
  completeLiquidation,
  rejectLiquidation,
  NETWORKS,
  type LiquidationSettings,
  type LiquidationGasWallet,
  type LiquidationWithUser,
} from "@/utils/liquidation";

const CURRENCIES: Currency[] = ["BTC", "ETH", "USDT", "SOL", "BNB", "LTC"];

export default function AdminLiquidationsPage() {
  const [loading, setLoading] = useState(true);
  const [, setSettings] = useState<LiquidationSettings | null>(null);
  const [gasWallets, setGasWallets] = useState<LiquidationGasWallet[]>([]);
  const [liquidations, setLiquidations] = useState<LiquidationWithUser[]>([]);
  const [filteredLiquidations, setFilteredLiquidations] = useState<LiquidationWithUser[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState({
    maxLiquidationPercentage: "",
    gasFeePercentage: "",
    isEnabled: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const [showAddWalletDialog, setShowAddWalletDialog] = useState(false);
  const [newWalletForm, setNewWalletForm] = useState({
    currency: "" as Currency | "",
    network: "",
    address: "",
  });
  const [newWalletQrCode, setNewWalletQrCode] = useState<File | null>(null);
  const [addingWallet, setAddingWallet] = useState(false);

  const [selectedLiquidation, setSelectedLiquidation] = useState<LiquidationWithUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, walletsData, liquidationsData] = await Promise.all([
        getLiquidationSettings(),
        getLiquidationGasWallets(),
        getAllLiquidations(),
      ]);

      setSettings(settingsData);
      setGasWallets(walletsData);
      setLiquidations(liquidationsData);
      setFilteredLiquidations(liquidationsData);

      if (settingsData) {
        setSettingsForm({
          maxLiquidationPercentage: settingsData.maxLiquidationPercentage?.toString() || "",
          gasFeePercentage: settingsData.gasFeePercentage?.toString() || "",
          isEnabled: settingsData.isEnabled || false,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch liquidation data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = liquidations;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (liq) =>
          liq.user?.name?.toLowerCase().includes(query) ||
          liq.user?.email?.toLowerCase().includes(query) ||
          liq.targetCrypto.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter((liq) => liq.status === statusFilter);
    }

    setFilteredLiquidations(result);
  }, [searchQuery, statusFilter, liquidations]);

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await updateLiquidationSettings(
        settingsForm.maxLiquidationPercentage
          ? parseFloat(settingsForm.maxLiquidationPercentage)
          : null,
        settingsForm.gasFeePercentage
          ? parseFloat(settingsForm.gasFeePercentage)
          : null,
        settingsForm.isEnabled
      );
      toast.success("Settings saved successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddWallet = async () => {
    if (!newWalletForm.currency || !newWalletForm.network || !newWalletForm.address) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setAddingWallet(true);
      await createLiquidationGasWallet(
        newWalletForm.currency as Currency,
        newWalletForm.network,
        newWalletForm.address,
        newWalletQrCode || undefined
      );
      toast.success("Gas wallet added successfully");
      setShowAddWalletDialog(false);
      setNewWalletForm({ currency: "", network: "", address: "" });
      setNewWalletQrCode(null);
      fetchData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add gas wallet"
      );
    } finally {
      setAddingWallet(false);
    }
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm("Are you sure you want to delete this gas wallet?")) return;

    try {
      await deleteLiquidationGasWallet(walletId);
      toast.success("Gas wallet deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete gas wallet");
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveLiquidation(id);
      toast.success("Liquidation approved successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to approve liquidation");
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (id: string) => {
    setProcessingId(id);
    try {
      await completeLiquidation(id);
      toast.success("Liquidation completed successfully");
      fetchData();
      setIsCompleting(false);
      setSelectedLiquidation(null);
    } catch (error) {
      toast.error("Failed to complete liquidation");
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
      await rejectLiquidation(id, reason);
      toast.success("Liquidation rejected successfully");
      fetchData();
      setIsRejecting(false);
      setSelectedLiquidation(null);
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject liquidation");
    } finally {
      setProcessingId(null);
    }
  };

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
          <p className="mt-2 text-lg">Loading liquidation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liquidation Management</h1>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="wallets">Gas Wallets</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Liquidation Settings
              </CardTitle>
              <CardDescription>
                Configure liquidation parameters and enable/disable the feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Liquidation</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to liquidate their assets
                  </p>
                </div>
                <Switch
                  checked={settingsForm.isEnabled}
                  onCheckedChange={(checked) =>
                    setSettingsForm({ ...settingsForm, isEnabled: checked })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Max Liquidation Percentage</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="e.g., 80"
                      value={settingsForm.maxLiquidationPercentage}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          maxLiquidationPercentage: e.target.value,
                        })
                      }
                      min="1"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum percentage of balance users can liquidate
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Gas Fee Percentage</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="e.g., 5"
                      value={settingsForm.gasFeePercentage}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          gasFeePercentage: e.target.value,
                        })
                      }
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gas fee charged on liquidation amount
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full md:w-auto"
              >
                {savingSettings ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Gas Fee Wallets
                </CardTitle>
                <CardDescription>
                  Manage wallets for receiving gas fee payments
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddWalletDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Wallet
              </Button>
            </CardHeader>
            <CardContent>
              {gasWallets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No gas wallets configured. Add a wallet to enable liquidations.
                </div>
              ) : (
                <div className="space-y-4">
                  {gasWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">
                            {wallet.currency.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {wallet.currency} - {wallet.network}
                          </p>
                          <p className="text-sm text-muted-foreground font-mono truncate max-w-xs">
                            {wallet.address}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteWallet(wallet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          {/* Workflow Explanation Card */}
          <Card className="mb-6 border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-amber-600" />
                Liquidation Workflow Guide
              </CardTitle>
              <CardDescription>
                Understanding the liquidation process and when to use each action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-lg">
                  <span className="font-medium text-sm">PENDING</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
                  <span className="font-medium text-sm">APPROVED</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                  <span className="font-medium text-sm">COMPLETED</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="font-semibold text-blue-600 min-w-[80px]">Approve:</div>
                  <p className="text-muted-foreground">
                    Click when you've reviewed the request and it's valid. <span className="text-amber-600 font-medium">Balance is NOT deducted yet.</span> The request is reserved and waiting for you to send the funds.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="font-semibold text-green-600 min-w-[80px]">Complete:</div>
                  <p className="text-muted-foreground">
                    Click <span className="text-green-600 font-medium">AFTER you've sent the crypto</span> to the user's wallet. <span className="text-green-600 font-medium">This deducts the balance</span> from the user's account.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="font-semibold text-red-600 min-w-[80px]">Reject:</div>
                  <p className="text-muted-foreground">
                    Click to deny the request. Provide a reason so the user understands why. Can be done from Pending or Approved status.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 w-full md:w-1/2">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or crypto..."
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

          <div className="bg-sidebar rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Gas Fee</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLiquidations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {liquidations.length === 0
                        ? "No liquidation requests"
                        : "No liquidations match your search criteria"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLiquidations.map((liq) => (
                    <TableRow key={liq.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{liq.user?.name || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">
                            {liq.user?.email || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            ${parseFloat(liq.sourceAmount).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {liq.sourceCurrency}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{liq.targetCrypto}</p>
                          <p className="text-sm text-muted-foreground">
                            {liq.targetNetwork}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${parseFloat(liq.gasFeeAmount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{liq.walletProvider}</p>
                          <p className="text-xs text-muted-foreground font-mono truncate max-w-[100px]">
                            {liq.walletAddress}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(liq.status)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(liq.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {liq.status === "PENDING" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleApprove(liq.id)}
                                disabled={processingId === liq.id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedLiquidation(liq);
                                  setRejectionReason("");
                                  setIsRejecting(true);
                                }}
                                disabled={processingId === liq.id}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          {liq.status === "APPROVED" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedLiquidation(liq);
                                  setIsCompleting(true);
                                }}
                                disabled={processingId === liq.id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedLiquidation(liq);
                                  setRejectionReason("");
                                  setIsRejecting(true);
                                }}
                                disabled={processingId === liq.id}
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
        </TabsContent>
      </Tabs>

      <Dialog open={showAddWalletDialog} onOpenChange={setShowAddWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Gas Fee Wallet</DialogTitle>
            <DialogDescription>
              Add a new wallet for receiving gas fee payments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={newWalletForm.currency}
                onValueChange={(v) =>
                  setNewWalletForm({ ...newWalletForm, currency: v as Currency })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Network</Label>
              <Select
                value={newWalletForm.network}
                onValueChange={(v) =>
                  setNewWalletForm({ ...newWalletForm, network: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORKS.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <Input
                placeholder="Enter wallet address"
                value={newWalletForm.address}
                onChange={(e) =>
                  setNewWalletForm({ ...newWalletForm, address: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>QR Code (Optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewWalletQrCode(e.target.files?.[0] || null)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddWalletDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddWallet} disabled={addingWallet}>
              {addingWallet ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Wallet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedLiquidation && isRejecting}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLiquidation(null);
            setIsRejecting(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Liquidation</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this liquidation request.
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
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLiquidation(null);
                setIsRejecting(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedLiquidation) {
                  handleReject(selectedLiquidation.id, rejectionReason);
                }
              }}
              disabled={
                !rejectionReason.trim() || processingId === selectedLiquidation?.id
              }
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedLiquidation && isCompleting}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLiquidation(null);
            setIsCompleting(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Liquidation</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this liquidation as complete? This
              will deduct the amount from the user's balance.
            </DialogDescription>
          </DialogHeader>
          {selectedLiquidation && (
            <div className="py-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User</span>
                <span>{selectedLiquidation.user?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>
                  ${parseFloat(selectedLiquidation.sourceAmount).toFixed(2)}{" "}
                  {selectedLiquidation.sourceCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target</span>
                <span>
                  {selectedLiquidation.targetCrypto} (
                  {selectedLiquidation.targetNetwork})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wallet</span>
                <span className="text-sm font-mono truncate max-w-[200px]">
                  {selectedLiquidation.walletAddress}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLiquidation(null);
                setIsCompleting(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (selectedLiquidation) {
                  handleComplete(selectedLiquidation.id);
                }
              }}
              disabled={processingId === selectedLiquidation?.id}
            >
              {processingId === selectedLiquidation?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Liquidation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

