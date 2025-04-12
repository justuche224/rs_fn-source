import { useEffect, useState } from "react";
import { Check, Copy, Eye, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSystemWallet, getSystemWallets } from "@/utils/wallets";
import { useNavigate } from "@tanstack/react-router";
import type { SystemWallet } from "@/utils/wallets";

export default function WalletsAdminPage() {
  const [wallets, setWallets] = useState<SystemWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<SystemWallet | null>(
    null
  );
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const data = await getSystemWallets();
      setWallets(data);
    } catch (error) {
      toast.error("Failed to fetch system wallets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    try {
      await deleteSystemWallet(id);
      toast.success("Wallet deleted successfully");
      fetchWallets();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete wallet");
    } finally {
      setProcessingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const viewQRCode = (wallet: SystemWallet) => {
    setSelectedWallet(wallet);
    setQrDialogOpen(true);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString();
  };

  const getCurrencyBadge = (currency: string) => {
    const colorMap: Record<string, string> = {
      BTC: "bg-orange-500",
      ETH: "bg-purple-500",
      USDT: "bg-green-500",
      SOL: "bg-blue-500",
      BNB: "bg-yellow-500",
      LTC: "bg-gray-500",
    };

    return (
      <Badge className={`${colorMap[currency] || "bg-gray-400"}`}>
        {currency}
      </Badge>
    );
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Wallets Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={fetchWallets}
            disabled={loading}
            variant="outline"
            className="cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
          <Button
            onClick={() => navigate({ to: "/admin/wallets/new" })}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Wallet
          </Button>
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
                <TableHead>Currency</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No system wallets found
                  </TableCell>
                </TableRow>
              ) : (
                wallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell>{getCurrencyBadge(wallet.currency)}</TableCell>
                    <TableCell className="font-mono text-sm max-w-[200px]">
                      <div className="flex items-center">
                        <span className="truncate">{wallet.address}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-8 w-8 p-0 cursor-pointer"
                          onClick={() => copyToClipboard(wallet.address)}
                        >
                          {copiedAddress === wallet.address ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(wallet.createdAt)}</TableCell>
                    <TableCell>{formatDate(wallet.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => viewQRCode(wallet)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          QR Code
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedWallet(wallet);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={processingId === wallet.id}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* QR Code Preview Dialog */}
      <Dialog
        open={qrDialogOpen}
        onOpenChange={(open) => {
          setQrDialogOpen(open);
          if (!open) setSelectedWallet(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet QR Code</DialogTitle>
            <DialogDescription>
              {selectedWallet?.currency} wallet address:{" "}
              {selectedWallet?.address}
            </DialogDescription>
          </DialogHeader>

          {selectedWallet && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="border rounded-md overflow-hidden p-2 bg-white">
                <img
                  src={selectedWallet.qrCode}
                  alt={`${selectedWallet.currency} Wallet QR Code`}
                  className="w-60 h-60 object-contain"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-sm truncate max-w-[200px]">
                  {selectedWallet.address}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(selectedWallet.address)}
                >
                  {copiedAddress === selectedWallet.address ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedWallet(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete System Wallet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {selectedWallet?.currency}{" "}
              wallet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground cursor-pointer"
              onClick={() => selectedWallet && handleDelete(selectedWallet.id)}
              disabled={processingId === selectedWallet?.id}
            >
              {processingId === selectedWallet?.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
