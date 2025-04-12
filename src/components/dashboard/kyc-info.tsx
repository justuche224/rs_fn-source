import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";
import { AccentCard } from "../ui/accent-card";

interface KYCImages {
  front: string;
  back: string;
  selfie: string;
}

interface KYCInfo {
  id: string;
  documentType: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  images: KYCImages;
}

export function KYCInfo() {
  const [kycData, setKycData] = useState<KYCInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKYCInfo = async () => {
      try {
        const response = await axios.get(
          "https://resonantfinance.onrender.com/api/kyc/info",
          {
            withCredentials: true,
          }
        );
        setKycData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchKYCInfo();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KYC Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!kycData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>KYC Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No KYC information available.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return (
          <Badge variant="secondary" className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="bg-red-500">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="h-full flex justify-center mt-10">
      <AccentCard title="KYC Information" className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            {getStatusBadge(kycData.status)}
          </div>

          <div>
            <span className="text-sm font-medium">Document Type</span>
            <p className="text-sm text-muted-foreground">
              {kycData.documentType}
            </p>
          </div>

          {kycData.rejectionReason && (
            <div>
              <span className="text-sm font-medium">Rejection Reason</span>
              <p className="text-sm text-red-500">{kycData.rejectionReason}</p>
            </div>
          )}

          <div>
            <span className="text-sm font-medium">Submitted On</span>
            <p className="text-sm text-muted-foreground">
              {new Date(kycData.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium">Last Updated</span>
            <p className="text-sm text-muted-foreground">
              {new Date(kycData.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <span className="text-sm font-medium">Front Image</span>
              <img
                src={kycData.images.front}
                alt="Front of document"
                className="mt-2 rounded-lg border"
              />
            </div>
            <div>
              <span className="text-sm font-medium">Back Image</span>
              <img
                src={kycData.images.back}
                alt="Back of document"
                className="mt-2 rounded-lg border"
              />
            </div>
            <div>
              <span className="text-sm font-medium">Selfie</span>
              <img
                src={kycData.images.selfie}
                alt="Selfie"
                className="mt-2 rounded-lg border"
              />
            </div>
          </div>
        </div>
      </AccentCard>
    </div>
  );
}
