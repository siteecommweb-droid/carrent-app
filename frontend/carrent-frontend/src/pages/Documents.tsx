import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Eye,
  Trash2,
  Globe,
  Lock,
  Sparkles,
  ScanFace,
  FileCheck,
  BadgeCheck,
} from "lucide-react";

import { uploadVerificationDocuments } from "@/lib/api";

interface UploadedDocument {
  id: number;
  type: string;
  fileName: string;
  uploadedAt: string;
  status: "pending" | "approved" | "rejected";
  size?: string;
  preview?: string;
}

export default function Documents() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("passport");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  /* ================= LOAD ================= */

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("uploaded_documents") || "[]"
      );
      setDocuments(saved);
    } catch {}
  }, []);

  /* ================= STORAGE ================= */

  function saveDocuments(docs: UploadedDocument[]) {
    setDocuments(docs);
    localStorage.setItem("uploaded_documents", JSON.stringify(docs));
  }

  /* ================= UPLOAD ================= */

  async function upload() {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await uploadVerificationDocuments(type, file);

      const newDoc: UploadedDocument = {
        id: Date.now(),
        type,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        status: "pending",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        preview: URL.createObjectURL(file),
      };

      const updated = [newDoc, ...documents];
      saveDocuments(updated);
      setSuccess(`${type} uploaded successfully`);
      setFile(null);

      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  /* ================= DELETE ================= */

  function deleteDocument(id: number) {
    const updated = documents.filter((d) => d.id !== id);
    saveDocuments(updated);
  }

  /* ================= SCORE ================= */

  const completion = useMemo(() => {
    return Math.min(Math.round((documents.length / 5) * 100), 100);
  }, [documents]);

  /* ================= TYPES ================= */

  const documentTypes = [
    { value: "passport", label: "Passport", icon: FileText },
    { value: "license", label: "Driver License", icon: BadgeCheck },
    { value: "selfie", label: "Selfie Photo", icon: ScanFace },
    { value: "id", label: "National ID", icon: Shield },
    { value: "utility_bill", label: "Utility Bill", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[420px_1fr] gap-6">

        {/* ================= LEFT ================= */}

        <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">

          <div className="bg-gradient-to-r from-[#165db8] via-cyan-500 to-[#0f172a] p-8 text-white relative overflow-hidden">

            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)]" />

            <div className="relative z-10">

              <div className="flex items-center gap-3 mb-4">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur">
                  <Shield className="h-8 w-8" />
                </div>

                <div>
                  <div className="text-3xl font-black">Secure KYC</div>
                  <div className="text-sm text-white/70">Global Identity Verification</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Verification Completion</span>
                  <span>{completion}%</span>
                </div>

                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    style={{ width: `${completion}%` }}
                    className="h-full bg-white rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-black">{documents.length}</div>
                  <div className="text-xs text-white/70">Uploaded Docs</div>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-black">Secure</div>
                  <div className="text-xs text-white/70">AES-256 Encryption</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-5">

            {success && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-emerald-700">
                <CheckCircle className="h-5 w-5" />
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-bold block mb-2">Document Type</label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-2xl border px-4 py-4 bg-white focus:ring-2 focus:ring-[#165db8] outline-none"
              >
                {documentTypes.map((dt) => (
                  <option key={dt.value} value={dt.value}>
                    {dt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2">Upload File</label>

              <div className="rounded-3xl border-2 border-dashed p-10 text-center hover:border-[#165db8] transition-all bg-slate-50">
                <input
                  id="file-input"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <label htmlFor="file-input" className="cursor-pointer block">
                  <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#165db8] to-cyan-500 mx-auto flex items-center justify-center text-white shadow-xl mb-5">
                    <Upload className="h-10 w-10" />
                  </div>

                  <div className="font-bold text-lg">
                    {file ? file.name : "Drag & Drop or Click"}
                  </div>

                  <div className="text-sm text-black/50 mt-2">
                    JPG, PNG, PDF • Max 10MB
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={upload}
              disabled={uploading || !file}
              className="w-full rounded-2xl bg-gradient-to-r from-[#165db8] to-cyan-500 text-white py-4 font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading Securely...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Upload Secure Document
                </>
              )}
            </button>

            <div className="rounded-2xl bg-slate-50 border p-5 text-sm text-black/60 space-y-3">
              <div className="flex items-center gap-2 font-bold text-black">
                <Lock className="h-4 w-4" />
                Enterprise Security
              </div>
              <div>• AES-256 encrypted storage</div>
              <div>• GDPR compliant identity handling</div>
              <div>• Fraud detection ready</div>
              <div>• AI verification compatible</div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">

          <div className="p-8 border-b flex items-center justify-between">
            <div>
              <div className="text-3xl font-black">Uploaded Documents</div>
              <div className="text-black/50 mt-1">Smart customer verification center</div>
            </div>

            <div className="rounded-2xl bg-[#165db8]/10 text-[#165db8] px-4 py-2 text-sm font-bold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global KYC Ready
            </div>
          </div>

          <div className="p-6 space-y-4">

            {documents.length === 0 ? (
              <div className="rounded-3xl border border-dashed p-20 text-center text-black/40">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <div className="text-lg font-bold">No documents uploaded yet</div>
                <div className="text-sm mt-2">Upload your documents to begin verification</div>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="rounded-3xl border p-5 hover:shadow-xl transition-all bg-white">
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-4 flex-1">

                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#165db8] to-cyan-500 text-white flex items-center justify-center shadow-lg">
                        <FileText className="h-8 w-8" />
                      </div>

                      <div className="flex-1">
                        <div className="font-black text-lg">{doc.fileName}</div>
                        <div className="text-sm text-black/50 mt-1">{doc.type}</div>

                        <div className="flex flex-wrap gap-3 mt-3 text-xs">
                          <div className="rounded-full bg-slate-100 px-3 py-1">{doc.size}</div>
                          <div className="rounded-full bg-slate-100 px-3 py-1">
                            {new Date(doc.uploadedAt).toLocaleString()}
                          </div>
                          <div className={`rounded-full px-3 py-1 font-bold ${
                            doc.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : doc.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {doc.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="h-12 w-12 rounded-2xl border hover:bg-slate-50 flex items-center justify-center">
                        <Eye className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="h-12 w-12 rounded-2xl border hover:bg-red-50 text-red-500 flex items-center justify-center"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}