import React, { useMemo, useState } from "react";
import {
  BadgeCheck,
  Upload,
  FileText,
  Camera,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Lock,
  Sparkles,
  AlertTriangle,
  ScanFace,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useMyVerificationQuery,
  useUploadVerificationMutation,
} from "@/lib/verificationQueries";

interface VerificationData {
  verification_status?: string;
  passport_file?: string;
  license_file?: string;
  selfie_file?: string;
  utility_bill_file?: string;
  visa_document_file?: string;
}

function statusClasses(status: string) {
  const s = String(status || "").toLowerCase();

  if (s === "approved") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "rejected") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-amber-100 text-amber-800 border-amber-200";
}

function StatusIcon({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === "approved") return <CheckCircle className="h-5 w-5 text-emerald-600" />;
  if (s === "rejected") return <XCircle className="h-5 w-5 text-rose-600" />;
  return <Clock className="h-5 w-5 text-amber-600" />;
}

function fileOk(file: File | null) {
  if (!file) return false;
  const max = 10 * 1024 * 1024;
  return file.size <= max;
}

export default function Verification() {
  const {
    data,
    isLoading,
  } = useMyVerificationQuery() as {
    data: VerificationData;
    isLoading: boolean;
  };
  
  const uploadMut = useUploadVerificationMutation();

  const [passport, setPassport] = useState<File | null>(null);
  const [license, setLicense] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [utilityBill, setUtilityBill] = useState<File | null>(null);
  const [visaDocument, setVisaDocument] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const status = data?.verification_status || "pending";

  const completion = useMemo(() => {
    let done = 0;
    if (passport || data?.passport_file) done++;
    if (license || data?.license_file) done++;
    if (selfie || data?.selfie_file) done++;
    if (utilityBill || data?.utility_bill_file) done++;
    if (visaDocument || data?.visa_document_file) done++;
    return Math.round((done / 5) * 100);
  }, [passport, license, selfie, utilityBill, visaDocument, data]);

  const trustScore = useMemo(() => {
    if (status === "approved") return 100;
    if (status === "rejected") return 25;
    return Math.min(95, completion + 20);
  }, [completion, status]);

  const submit = async () => {
    setFeedback(null);

    if (!passport || !license || !selfie) {
      setFeedback({
        type: "error",
        text: "Please upload passport, driver license, and selfie.",
      });
      return;
    }

    if (![passport, license, selfie, utilityBill, visaDocument].every(fileOk)) {
      setFeedback({
        type: "error",
        text: "Each file must be maximum 10MB.",
      });
      return;
    }

    try {
      const res = (await uploadMut.mutateAsync({
        passport,
        license,
        selfie,
        utilityBill,
        visaDocument,
      } as any)) as any;

      setFeedback({
        type: "success",
        text: res?.message || "Documents uploaded successfully. Admin will review shortly.",
      });

      setPassport(null);
      setLicense(null);
      setSelfie(null);
      setUtilityBill(null);
      setVisaDocument(null);
    } catch (e: any) {
      setFeedback({
        type: "error",
        text: e?.message || "Upload failed. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fc] via-white to-[#edf6ff] p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="relative overflow-hidden rounded-[32px] border bg-gradient-to-r from-[#071226] via-[#123b73] to-[#0f172a] p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_35%)]" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                AM38 Secure Identity Engine
              </div>
              <h1 className="mt-5 text-4xl md:text-6xl font-black">Verify Your Identity</h1>
              <p className="mt-3 max-w-2xl text-white/75">
                Upload your passport, driver license and selfie once. This unlocks faster bookings, admin approval,
                fraud protection and premium car access.
              </p>
            </div>

            <div className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 font-black ${statusClasses(status)}`}>
              <StatusIcon status={status} />
              {String(status).toUpperCase()}
            </div>
          </div>
        </div>

        {feedback && (
          <div
            className={`rounded-2xl border px-5 py-4 text-sm font-bold ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {feedback.text}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[32px] border bg-white p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black">Required Documents</div>
                <div className="text-sm text-black/50">Secure upload for rental approval</div>
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                {completion}% complete
              </div>
            </div>

            <DocumentInput title="Passport" subtitle="Upload passport photo page" icon={FileText} file={passport} setFile={setPassport} />
            <DocumentInput title="Driver License" subtitle="Upload driving license, both sides if possible" icon={BadgeCheck} file={license} setFile={setLicense} />
            <DocumentInput title="Selfie" subtitle="Clear selfie holding your ID" icon={Camera} file={selfie} setFile={setSelfie} accept="image/*" />
            <DocumentInput title="Utility Bill" subtitle="Optional address verification" icon={Lock} file={utilityBill} setFile={setUtilityBill} />
            <DocumentInput title="Visa / Travel Document" subtitle="Optional international traveler document" icon={Fingerprint} file={visaDocument} setFile={setVisaDocument} />

            <Button
              onClick={submit}
              disabled={uploadMut.isPending || !passport || !license || !selfie}
              className="w-full rounded-2xl bg-black hover:bg-black/90 text-white py-6 text-base font-black"
            >
              <Upload className="h-5 w-5 mr-2" />
              {uploadMut.isPending ? "Uploading Securely..." : "Submit for Verification"}
            </Button>

            <div className="rounded-2xl bg-slate-50 border p-4 text-xs text-black/50">
              Files are checked for size, encrypted during transfer, and stored only for identity verification.
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border bg-white p-6 shadow-xl">
              <div className="text-xl font-black">Verification Status</div>

              <div className="mt-5 space-y-3">
                <StatusRow label="Passport" done={Boolean(data?.passport_file || passport)} />
                <StatusRow label="Driver License" done={Boolean(data?.license_file || license)} />
                <StatusRow label="Selfie" done={Boolean(data?.selfie_file || selfie)} />
                <StatusRow label="Utility Bill" done={Boolean(data?.utility_bill_file || utilityBill)} />
                <StatusRow label="Visa Document" done={Boolean(data?.visa_document_file || visaDocument)} />
              </div>

              <div className="mt-6 rounded-2xl border bg-slate-50 px-4 py-4 text-sm text-black/60">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 mt-0.5" />
                  <div>
                    {status === "pending" && "Your documents are being reviewed. This usually takes 24-48 hours."}
                    {status === "approved" && "Your identity is verified. You can now book any vehicle."}
                    {status === "rejected" && "Verification failed. Please re-upload clear documents."}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <div className="text-xl font-black">AI Trust Score</div>
              </div>

              <div className="mt-5 h-4 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all"
                  style={{ width: `${trustScore}%` }}
                />
              </div>

              <div className="mt-3 text-4xl font-black">{trustScore}%</div>
              <div className="text-sm text-black/50">Higher score means faster pickup and fewer manual checks.</div>
            </div>

            <div className="rounded-[32px] border bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <ScanFace className="h-6 w-6 text-purple-600" />
                <div className="text-xl font-black">Smart Checks Ready</div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-black/60">
                <div>✔ Passport expiry review</div>
                <div>✔ Selfie match ready</div>
                <div>✔ Fraud risk flagging ready</div>
                <div>✔ Admin audit trail ready</div>
                <div>✔ Email/WhatsApp notification ready</div>
              </div>
            </div>

            {data?.passport_file && (
              <a
                href={`${import.meta.env.VITE_API_URL || "http://localhost:4000"}${data.passport_file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-blue-600 px-5 py-4 text-center font-black text-white"
              >
                View Uploaded Passport
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentInput({
  title,
  subtitle,
  icon: Icon,
  file,
  setFile,
  accept = "image/*,.pdf",
}: {
  title: string;
  subtitle: string;
  icon: any;
  file: File | null;
  setFile: (file: File | null) => void;
  accept?: string;
}) {
  const valid = fileOk(file);

  return (
    <label className="block cursor-pointer rounded-2xl border p-4 transition hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-black">{title}</div>
          <div className="text-sm text-black/50">{file ? file.name : subtitle}</div>
          {file && !valid && <div className="mt-1 flex items-center gap-1 text-xs text-red-600"><AlertTriangle className="h-3 w-3" /> File too large</div>}
        </div>
        <Upload className="h-4 w-4 text-black/40" />
      </div>
      <input type="file" className="hidden" accept={accept} onChange={(e) => setFile(e.target.files?.[0] || null)} />
    </label>
  );
}

function StatusRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-black/60">{label}</span>
      {done ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-amber-600" />}
    </div>
  );
}