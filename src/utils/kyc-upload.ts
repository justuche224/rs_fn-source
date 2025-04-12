import axios from "axios";

export type DocumentType = "ID_CARD" | "DRIVERS_LICENSE" | "PASSPORT" | "OTHER";

export interface KYCUploadResponse {
  success: boolean;
  kyc: {
    id: string;
    userId: string;
    documentType: DocumentType;
    status: "PENDING";
    createdAt: Date;
  };
}

export const uploadKYC = async (
  frontFile: File,
  backFile: File,
  selfieFile: File,
  documentType: DocumentType,
  userId: string
): Promise<KYCUploadResponse> => {
  const formData = new FormData();
  formData.append("front", frontFile);
  formData.append("back", backFile);
  formData.append("selfie", selfieFile);
  formData.append("documentType", documentType);
  formData.append("userId", userId);

  const response = await axios.post(
    "http://localhost:5000/api/kyc/upload",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
