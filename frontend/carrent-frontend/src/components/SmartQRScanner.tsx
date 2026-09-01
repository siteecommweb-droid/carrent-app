import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  Camera,
  Copy,
  Check,
  ShieldCheck,
  Download,
} from "lucide-react";

import { QRCodeCanvas } from "qrcode.react";

interface SmartQRScannerProps {
  tripData: any;
  onScan?: (data: string) => void;
}

export default function SmartQRScanner({
  tripData,
}: SmartQRScannerProps) {
  const [copied, setCopied] = useState(false);

  const qrValue = useMemo(() => {
    return JSON.stringify({
      type: "AM38_TRIP",
      trip: tripData,
      timestamp: Date.now(),
    });
  }, [tripData]);

  const copyQRData = async () => {
    await navigator.clipboard.writeText(qrValue);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const downloadQR = () => {
    const canvas = document.querySelector("canvas");

    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");

    a.href = url;
    a.download = "am38-trip-qr.png";

    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="rounded-full bg-cyan-500/20 p-2 text-cyan-300">
            <QrCode size={18} />
          </div>

          <h3 className="text-lg font-black text-white">
            Smart QR Trip Pass
          </h3>
        </div>

        <div className="inline-block rounded-3xl border border-white/10 bg-white p-4 shadow-2xl shadow-cyan-500/20">
          <QRCodeCanvas
            value={qrValue}
            size={180}
            includeMargin
          />
        </div>

        <p className="mt-4 text-sm text-white/70">
          Scan with phone to instantly access:
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl bg-white/10 p-2 text-white">
            Live itinerary
          </div>

          <div className="rounded-xl bg-white/10 p-2 text-white">
            Booking details
          </div>

          <div className="rounded-xl bg-white/10 p-2 text-white">
            Airport pickup
          </div>

          <div className="rounded-xl bg-white/10 p-2 text-white">
            Emergency support
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={copyQRData}
            className="flex-1 rounded-xl bg-white/15 py-3 text-sm font-bold text-white transition hover:bg-white/25"
          >
            <div className="flex items-center justify-center gap-2">
              {copied ? (
                <Check size={15} />
              ) : (
                <Copy size={15} />
              )}

              {copied ? "Copied!" : "Copy QR"}
            </div>
          </button>

          <button
            onClick={downloadQR}
            className="flex-1 rounded-xl bg-cyan-500 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            <div className="flex items-center justify-center gap-2">
              <Download size={15} />
              Download
            </div>
          </button>
        </div>

        <button className="mt-3 w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-500">
          <div className="flex items-center justify-center gap-2">
            <Camera size={15} />
            Scan QR
          </div>
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-cyan-300">
          <ShieldCheck size={13} />
          Secure encrypted AM38 QR technology
        </div>
      </div>
    </motion.div>
  );
}