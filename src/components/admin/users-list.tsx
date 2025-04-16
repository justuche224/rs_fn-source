import { useEffect, useState } from "react";
import { Eye, Loader2, Search, Trash, UserX, Wallet } from "lucide-react";

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
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { getAllUsers, deleteUser, getUserById } from "@/utils/users";
import {
  adminAdjustBalance,
  type Currency,
  type AdminAdjustBalanceResponse,
  getSpecificUserIndividualBalance,
  type Balance,
} from "@/utils/balance";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "ADMIN" | "USER";
  phone: string | null;
  twoFactorEnabled: boolean;
  kycVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function UserAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processingDelete, setProcessingDelete] = useState(false);
  const [adjustBalanceDialogOpen, setAdjustBalanceDialogOpen] = useState(false);
  const [adjustUserId, setAdjustUserId] = useState<string | null>(null);
  const [adjustCurrency, setAdjustCurrency] = useState<Currency | "">("");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [processingAdjust, setProcessingAdjust] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [currentUserBalances, setCurrentUserBalances] = useState<Balance | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name?.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.id.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const handleViewUser = async (userId: string) => {
    try {
      const user = await getUserById(userId);
      setSelectedUser(user);
      setUserDetailOpen(true);
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  const handleDeleteUsers = async () => {
    if (selectedUserIds.size === 0) return;

    try {
      setProcessingDelete(true);
      await deleteUser(Array.from(selectedUserIds));
      toast.success(`Successfully deleted ${selectedUserIds.size} user(s)`);
      setSelectedUserIds(new Set());
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete users");
    } finally {
      setProcessingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const toggleSelectUser = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  const selectAllUsers = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      // If all are selected, unselect all
      setSelectedUserIds(new Set());
    } else {
      // Otherwise select all filtered users
      setSelectedUserIds(new Set(filteredUsers.map((user) => user.id)));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const getRoleBadge = (role: string) => {
    return role === "ADMIN" ? (
      <Badge className="bg-purple-500">Admin</Badge>
    ) : (
      <Badge variant="outline">User</Badge>
    );
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge className="bg-green-500">Verified</Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
        Unverified
      </Badge>
    );
  };

  const handleOpenAdjustBalance = async (userId: string) => {
    setAdjustUserId(userId);
    setAdjustCurrency("");
    setAdjustAmount("");
    setCurrentUserBalances(null);
    setLoadingBalances(true);
    setAdjustBalanceDialogOpen(true);
    setProcessingAdjust(false);

    try {
      const balances = await getSpecificUserIndividualBalance(userId);
      setCurrentUserBalances(balances);
    } catch (error) {
      console.error("Failed to fetch user balances:", error);
      toast.error("Failed to load user balances");
    } finally {
      setLoadingBalances(false);
    }
  };

  const handleAdjustBalanceSubmit = async () => {
    if (!adjustUserId || !adjustCurrency || !adjustAmount) {
      toast.error("Please select a currency and enter an amount.");
      return;
    }

    if (!/^-?\d+$/.test(adjustAmount)) {
      toast.error("Amount must be a whole number (positive or negative).");
      return;
    }

    setProcessingAdjust(true);
    try {
      const result: AdminAdjustBalanceResponse = await adminAdjustBalance({
        userId: adjustUserId,
        currency: adjustCurrency,
        amount: adjustAmount,
      });
      toast.success(
        `Successfully adjusted ${adjustCurrency} balance. New balance: ${result.newBalance}`
      );
      setAdjustBalanceDialogOpen(false);
      setCurrentUserBalances(null);
    } catch (error: any) {
      console.error("Balance adjustment error:", error);
      const errorMsg =
        error.response?.data?.error ||
        error.message ||
        "Failed to adjust balance";
      toast.error(errorMsg);
    } finally {
      setProcessingAdjust(false);
    }
  };

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={fetchUsers}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Loading..." : "Refresh"}
          </Button>
          {selectedUserIds.size > 0 && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="cursor-pointer"
              disabled={processingDelete}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete ({selectedUserIds.size})
            </Button>
          )}
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
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedUserIds.size > 0 &&
                      selectedUserIds.size === filteredUsers.length
                    }
                    onCheckedChange={selectAllUsers}
                    className="cursor-pointer"
                    aria-label="Select all users"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    {searchQuery
                      ? "No users found matching your search"
                      : "No users found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                        className="cursor-pointer"
                        aria-label={`Select ${user.name || "user"}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.name || user.id.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>
                      {getVerificationBadge(user.emailVerified)}
                    </TableCell>
                    <TableCell>
                      {user.kycVerified ? (
                        <Badge className="bg-green-500">Verified</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">
                          Not Verified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenAdjustBalance(user.id)}
                        >
                          <Wallet className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedUserIds(new Set([user.id]));
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <UserX className="h-4 w-4 mr-1" />
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

      {/* User Detail Dialog */}
      <Dialog
        open={userDetailOpen}
        onOpenChange={(open) => {
          setUserDetailOpen(open);
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about this user.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">User ID:</h3>
                  <p className="text-sm text-gray-600">{selectedUser.id}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Role:</h3>
                  <p>{getRoleBadge(selectedUser.role)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Name:</h3>
                  <p className="text-sm">
                    {selectedUser.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Email:</h3>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email Verification:</h3>
                  <p>{getVerificationBadge(selectedUser.emailVerified)}</p>
                </div>
                <div>
                  <h3 className="font-semibold">KYC Status:</h3>
                  <p>
                    {selectedUser.kycVerified ? (
                      <Badge className="bg-green-500">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">
                        Not Verified
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Phone:</h3>
                  <p className="text-sm">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">2FA Enabled:</h3>
                  <p>
                    {selectedUser.twoFactorEnabled ? (
                      <Badge className="bg-green-500">Enabled</Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Created At:</h3>
                  <p className="text-sm">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Last Updated:</h3>
                  <p className="text-sm">
                    {formatDate(selectedUser.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUserDetailOpen(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedUser) {
                  setUserDetailOpen(false);
                  setSelectedUserIds(new Set([selectedUser.id]));
                  setDeleteDialogOpen(true);
                }
              }}
              className="cursor-pointer"
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open && !processingDelete) {
            setSelectedUserIds(new Set());
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm User Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUserIds.size > 1
                ? `Are you sure you want to delete ${selectedUserIds.size} users? This action cannot be undone.`
                : "Are you sure you want to delete this user? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteUsers();
              }}
              disabled={processingDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {processingDelete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Adjust Balance Dialog */}
      <Dialog
        open={adjustBalanceDialogOpen}
        onOpenChange={(open) => {
          if (!processingAdjust) {
            setAdjustBalanceDialogOpen(open);
            if (!open) {
              setAdjustUserId(null);
              setAdjustCurrency("");
              setAdjustAmount("");
              setCurrentUserBalances(null);
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust User Balance</DialogTitle>
            <DialogDescription>
              View current balances and adjust for a specific currency. Enter the
              amount to add (e.g., 100) or remove (e.g., -50).
            </DialogDescription>
          </DialogHeader>
          {loadingBalances ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="animate-spin mr-2" /> Loading balances...
            </div>
          ) : currentUserBalances ? (
            <div className="my-4 px-1">
              <h4 className="font-semibold mb-2">Current Balances:</h4>
              <div className="text-sm grid grid-cols-3 gap-x-4 gap-y-1">
                {Object.entries(currentUserBalances).map(([currency, amount]) => (
                  <div key={currency}>
                    <span className="font-medium">{currency}:</span> {String(amount)}
                  </div>
                ))}
                {Object.keys(currentUserBalances).length === 0 && (
                  <div className="col-span-3 text-gray-500">No balances found.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">Could not load balances.</div>
          )}
          <div className="grid gap-4 pt-1 pb-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Select
                value={adjustCurrency}
                onValueChange={(value) => setAdjustCurrency(value as Currency | "")}
                disabled={processingAdjust}
              >
                <SelectTrigger className="col-span-3" id="currency">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="BNB">BNB</SelectItem>
                  <SelectItem value="LTC">LTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 100 or -50"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                className="col-span-3"
                disabled={processingAdjust}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdjustBalanceDialogOpen(false)}
              disabled={processingAdjust}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdjustBalanceSubmit}
              disabled={
                processingAdjust || !adjustCurrency || adjustAmount === ""
              }
              className="cursor-pointer"
            >
              {processingAdjust ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adjusting...
                </>
              ) : (
                "Adjust Balance"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
