import { useEffect, useState } from "react";
import { Eye, Loader2, Search, Trash, UserX } from "lucide-react";

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

import { getAllUsers, deleteUser, getUserById } from "@/utils/users";

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
    </div>
  );
}
