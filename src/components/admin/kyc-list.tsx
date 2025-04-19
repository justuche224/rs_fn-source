import { useEffect, useState } from "react";
import axios from "axios";
import { Check, Eye, Loader2, X } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  phone: string | null;
  twoFactorEnabled: boolean;
  kycVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KYCDocument {
  id: string;
  userId: string;
  documentType: string;
  frontImage: string;
  backImage: string;
  selfieImage: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface KYCData {
  kyc: KYCDocument;
  user: User;
}

export default function KYCAdminPage() {
  const [kycData, setKycData] = useState<KYCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(
    null
  );
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  // https://api.resonantfinance.org
  const fetchKYCData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.resonantfinance.org/api/kyc",
        {
          withCredentials: true,
        }
      );
      setKycData(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch KYC data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await axios
      .put(
        `https://api.resonantfinance.org/api/kyc/status`,
        {
          kycId: id,
          status: "APPROVED",
        },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("KYC document approved successfully");
        fetchKYCData();
      })
      .catch(() => {
        toast.error("Failed to approve KYC document");
      })
      .finally(() => {
        setProcessingId(null);
      });
  };

  const handleReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setProcessingId(id);
    await axios
      .put(
        `https://api.resonantfinance.org/api/kyc/status`,
        {
          kycId: id,
          status: "REJECTED",
          reason,
        },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("KYC document rejected successfully");
        fetchKYCData();
      })
      .catch(() => {
        toast.error("Failed to reject KYC document");
      })
      .finally(() => {
        setProcessingId(null);
      });
  };

  const viewImages = (document: KYCDocument) => {
    setSelectedDocument(document);
    setImageDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
    fetchKYCData();
  }, []);

  return (
    <div className="container mx-auto py-6 md:w-[90%] lg:w-[85%] px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">KYC Verification Dashboard</h1>
        <Button
          onClick={fetchKYCData}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? "Loading..." : "Refresh"}
        </Button>
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
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kycData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No KYC documents found
                  </TableCell>
                </TableRow>
              ) : (
                kycData.map((data) => (
                  <TableRow key={data.kyc.id}>
                    <TableCell className="font-medium">
                      {data.user.name || data.user.id.substring(0, 8) + "..."}
                    </TableCell>
                    <TableCell>
                      {data.kyc.documentType.replace("_", " ")}
                    </TableCell>
                    <TableCell>{getStatusBadge(data.kyc.status)}</TableCell>
                    <TableCell>{formatDate(data.kyc.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          className="cursor-pointer"
                          variant="outline"
                          size="sm"
                          onClick={() => viewImages(data.kyc)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {data.kyc.status === "PENDING" && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 cursor-pointer"
                              onClick={() => handleApprove(data.kyc.id)}
                              disabled={processingId === data.kyc.id}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedDocument(data.kyc);
                                setRejectionReason("");
                                setIsRejecting(true);
                              }}
                              disabled={processingId === data.kyc.id}
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

      {/* Image Preview Dialog */}
      <Dialog
        open={imageDialogOpen}
        onOpenChange={(open) => {
          setImageDialogOpen(open);
          if (!open) setSelectedDocument(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Images</DialogTitle>
            <DialogDescription>
              {selectedDocument?.documentType.replace("_", " ")} submitted by{" "}
              {kycData.find((data) => data.kyc.id === selectedDocument?.id)
                ?.user.name || selectedDocument?.userId}
              {kycData.find((data) => data.kyc.id === selectedDocument?.id)
                ?.user.email &&
                ` (${
                  kycData.find((data) => data.kyc.id === selectedDocument?.id)
                    ?.user.email
                })`}
            </DialogDescription>
          </DialogHeader>

          {selectedDocument && (
            <Tabs defaultValue="front" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="front">Front Image</TabsTrigger>
                <TabsTrigger value="back">Back Image</TabsTrigger>
                <TabsTrigger value="selfie">Selfie</TabsTrigger>
              </TabsList>

              <TabsContent value="front" className="flex justify-center">
                <div className="border rounded-md overflow-hidden max-h-[500px]">
                  <img
                    src={`https://api.resonantfinance.org/api/kyc/images/${selectedDocument.frontImage}`}
                    alt="Front Document"
                    className="object-contain max-h-[400px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="back" className="flex justify-center">
                <div className="border rounded-md overflow-hidden max-h-[500px]">
                  <img
                    src={`https://api.resonantfinance.org/api/kyc/images/${selectedDocument.backImage}`}
                    alt="Back Document"
                    className="object-contain max-h-[400px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="selfie" className="flex justify-center">
                <div className="border rounded-md overflow-hidden max-h-[500px]">
                  <img
                    src={`https://api.resonantfinance.org/api/kyc/images/${selectedDocument.selfieImage}`}
                    alt="Selfie"
                    className="object-contain max-h-[400px]"
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}

          {selectedDocument?.status === "PENDING" && (
            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 cursor-pointer"
                onClick={() => {
                  handleApprove(selectedDocument.id);
                  setImageDialogOpen(false);
                }}
                disabled={processingId === selectedDocument.id}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                className="cursor-pointer"
                variant="destructive"
                onClick={() => {
                  setImageDialogOpen(false);
                  setIsRejecting(true);
                }}
                disabled={processingId === selectedDocument.id}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog
        open={!!selectedDocument && isRejecting}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDocument(null);
            setIsRejecting(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject KYC Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document.
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
              onClick={() => setSelectedDocument(null)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={() => {
                if (selectedDocument) {
                  handleReject(selectedDocument.id, rejectionReason);
                  setSelectedDocument(null);
                }
              }}
              disabled={
                !rejectionReason.trim() || processingId === selectedDocument?.id
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
