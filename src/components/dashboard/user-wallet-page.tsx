import { useEffect, useState } from "react";
import { Check, Copy, Loader2, Plus, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createUserWallet,
  deleteUserWallet,
  getUserWallets,
  type Currency,
  type UserWallet,
} from "@/utils/wallets";
import { useNavigate } from "@tanstack/react-router";

export default function UserWalletPage({
  callbackURL,
}: {
  callbackURL?: string;
}) {
  const [userWallets, setUserWallets] = useState<UserWallet[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newWalletOpen, setNewWalletOpen] = useState(false);
  const [newWalletCurrency, setNewWalletCurrency] = useState<Currency | "">("");
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchUserWallets = async () => {
    try {
      setLoading(true);
      const data = await getUserWallets();
      // Ensure data is always an array (API might return a single object or array)
      setUserWallets(data);
    } catch (error) {
      toast("No Wallets Found");
      setUserWallets(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (!walletId) return;
    setDeleting(true);
    try {
      await deleteUserWallet(walletId);
      toast.success("Wallet deleted successfully");
      fetchUserWallets();
    } catch (error) {
      toast.error("Failed to delete wallet. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateWallet = async () => {
    if (!newWalletCurrency || !newWalletAddress.trim()) {
      toast.error("Please enter both currency and wallet address");
      return;
    }

    try {
      setCreating(true);
      await createUserWallet(newWalletCurrency, newWalletAddress);
      toast.success(`${newWalletCurrency} wallet added successfully`);
      if (callbackURL) {
        navigate({ to: callbackURL });
      } else {
        // Update wallet list
        fetchUserWallets();
        // Reset form
        setNewWalletOpen(false);
        setNewWalletCurrency("");
        setNewWalletAddress("");
      }
    } catch (error) {
      toast.error("Failed to add wallet. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getCurrencyIcon = (currency: string) => {
    // You can replace these with actual crypto currency icons
    const colorMap: Record<string, string> = {
      BTC: "bg-orange-500",
      ETH: "bg-purple-500",
      USDT: "bg-green-500",
      SOL: "bg-blue-500",
      BNB: "bg-yellow-500",
      LTC: "bg-gray-500",
    };

    return (
      <div
        className={`${colorMap[currency] || "bg-gray-400"} p-3 rounded-full`}
      >
        <Wallet className="h-6 w-6 text-white" />
      </div>
    );
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchUserWallets();
  }, []);

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Wallets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your cryptocurrency wallets
          </p>
        </div>
        <Dialog open={newWalletOpen} onOpenChange={setNewWalletOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add New Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Wallet</DialogTitle>
              <DialogDescription>
                Enter your cryptocurrency wallet details below
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={newWalletCurrency}
                  onValueChange={(value) =>
                    setNewWalletCurrency(value as Currency)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                    <SelectItem value="BNB">Binance Coin (BNB)</SelectItem>
                    <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your wallet address"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNewWalletOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWallet}
                disabled={creating || !newWalletCurrency || !newWalletAddress}
                className="cursor-pointer"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Wallet"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userWallets?.length ? (
            userWallets.map((wallet) => (
              <Card className="overflow-hidden relative" key={wallet.id}>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="absolute top-0 right-0 cursor-pointer hover:scale-95 hover:opacity-75 transition-all duration-300"
                      variant={"destructive"}
                      size={"icon"}
                    >
                      <Trash2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this {wallet.currency}{" "}
                        wallet? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button
                          disabled={deleting}
                          variant="outline"
                          onClick={() => {}}
                          className="cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        disabled={deleting}
                        variant="destructive"
                        onClick={() => handleDeleteWallet(wallet.id)}
                        className="cursor-pointer"
                      >
                        Delete Wallet
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <CardHeader className="flex flex-row items-center gap-4">
                  {getCurrencyIcon(wallet.currency)}
                  <div>
                    <CardTitle>{wallet.currency}</CardTitle>
                    <CardDescription>
                      Added on {formatDate(wallet.createdAt)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm truncate max-w-[80%]">
                        {wallet.address}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 cursor-pointer"
                        onClick={() => copyToClipboard(wallet.address)}
                      >
                        {copiedAddress === wallet.address ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 px-6 py-3">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {formatDate(wallet.updatedAt)}
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg border border-dashed">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No wallets added yet</h3>
              <p className="text-muted-foreground mb-4">
                Add a cryptocurrency wallet to get started
              </p>
              <Button
                onClick={() => setNewWalletOpen(true)}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Wallet
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Important Information</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>
            • Always double-check your wallet addresses before making
            transactions.
          </li>
          <li>
            • We recommend using hardware wallets for storing large amounts of
            cryptocurrency.
          </li>
          <li>• Never share your private keys with anyone.</li>
          <li>• Keep your recovery phrases in a safe, offline location.</li>
        </ul>
      </div>
    </div>
  );
}
