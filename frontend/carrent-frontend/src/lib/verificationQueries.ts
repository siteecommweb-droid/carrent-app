import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchAdminVerification,
  fetchAdminVerifications,
  fetchMyVerification,
  updateAdminVerification,
  uploadVerificationDocuments,
  approveVerification,
  rejectVerification,
  resendVerificationRequest,
} from "@/lib/api";

export interface VerificationUploadPayload {
  passport?: File | null;
  license?: File | null;
  selfie?: File | null;
  utilityBill?: File | null;
  visaDocument?: File | null;
}

export interface VerificationFilters {
  status?: string;
  q?: string;
  country?: string;
  riskLevel?: string;
}

export function useMyVerificationQuery() {
  return useQuery({
    queryKey: ["my-verification"],
    queryFn: fetchMyVerification,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useUploadVerificationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: VerificationUploadPayload) => {
      const uploads: Promise<any>[] = [];

      if (payload.passport) uploads.push(uploadVerificationDocuments("passport", payload.passport));
      if (payload.license) uploads.push(uploadVerificationDocuments("license", payload.license));
      if (payload.selfie) uploads.push(uploadVerificationDocuments("selfie", payload.selfie));
      if (payload.utilityBill) uploads.push(uploadVerificationDocuments("utility_bill", payload.utilityBill));
      if (payload.visaDocument) uploads.push(uploadVerificationDocuments("visa_document", payload.visaDocument));

      return Promise.all(uploads);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-verification"] });
      qc.invalidateQueries({ queryKey: ["admin-verifications"] });
    },
  });
}

export function useAdminVerificationsQuery(params?: VerificationFilters) {
  return useQuery({
    queryKey: ["admin-verifications", params],
    queryFn: () => fetchAdminVerifications(params),
    refetchInterval: 30000,
    staleTime: 1000 * 15,
    retry: 2,
  });
}

export function useAdminVerificationQuery(id?: number) {
  return useQuery({
    queryKey: ["admin-verification", id],
    queryFn: () => fetchAdminVerification(id!),
    enabled: !!id,
    staleTime: 1000 * 15,
  });
}

export function useAdminUpdateVerificationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      verification_status,
      rejection_reason,
      risk_level,
      admin_notes,
    }: {
      id: number;
      verification_status: "pending" | "approved" | "rejected";
      rejection_reason?: string;
      risk_level?: "low" | "medium" | "high";
      admin_notes?: string;
    }) =>
      updateAdminVerification(id, {
        verification_status,
        rejection_reason,
        risk_level,
        admin_notes,
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-verification", vars.id] });
      qc.invalidateQueries({ queryKey: ["admin-verifications"] });
      qc.invalidateQueries({ queryKey: ["my-verification"] });
    },
  });
}

export function useApproveVerificationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (verificationId: number) => approveVerification(verificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-verifications"] });
      qc.invalidateQueries({ queryKey: ["my-verification"] });
    },
  });
}

export function useRejectVerificationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ verificationId, reason }: { verificationId: number; reason: string }) =>
      rejectVerification(verificationId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-verifications"] });
      qc.invalidateQueries({ queryKey: ["my-verification"] });
    },
  });
}

export function useResendVerificationMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (verificationId: number) => resendVerificationRequest(verificationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-verifications"] });
    },
  });
}

export function getVerificationStatusColor(status?: string) {
  switch (status) {
    case "approved":
      return "emerald";
    case "rejected":
      return "red";
    case "pending":
      return "yellow";
    default:
      return "gray";
  }
}

export function calculateVerificationRisk(documentsUploaded: number) {
  if (documentsUploaded >= 5) return "low";
  if (documentsUploaded >= 3) return "medium";
  return "high";
}

export function getVerificationCompletion(payload: VerificationUploadPayload) {
  let total = 0;
  if (payload.passport) total++;
  if (payload.license) total++;
  if (payload.selfie) total++;
  if (payload.utilityBill) total++;
  if (payload.visaDocument) total++;
  return Math.round((total / 5) * 100);
}

export function calculateTrustScore(completion: number, risk: string) {
  let score = completion;
  if (risk === "low") score += 20;
  if (risk === "medium") score += 10;
  return Math.min(score, 100);
}