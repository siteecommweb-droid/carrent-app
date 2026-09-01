import { motion } from "framer-motion";
import {
  Download,
  Share2,
  FileText,
  Printer,
  Copy,
  CheckCircle,
  QrCode,
  Image,
  Mail,
} from "lucide-react";

import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { trackTripExport } from "@/services/tripExport.api";

interface TripExporterProps {
  tripData: any;
  onExport: (format: string) => void;
}

export default function TripExporter({
  tripData,
  onExport,
}: TripExporterProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  async function track(
    export_type: string,
    shared_platform?: string
  ) {
    try {
      await trackTripExport({
        trip_id: tripData?.id || null,
        export_type,
        shared_platform,
        export_title: tripData?.title || "Mauritius Trip",
        export_description: tripData?.description || "",
        device_info: navigator.platform,
        browser_info: navigator.userAgent,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const shareOnSocial = async (platform: string) => {
    const text = `Check out my Mauritius trip plan on AM38! I'll be visiting ${
      tripData.places?.length || 0
    } places. 🚗🌴 #AM38 #Mauritius`;

    const url = window.location.href;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        text + " " + url
      )}`,
    };

    await track("share", platform);

    window.open(shareUrls[platform], "_blank");
  };

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);

    await track("share", "copy");

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsPDF = async () => {
    setIsExporting(true);

    try {
      const element = document.getElementById("trip-content");

      if (!element) return;

      const canvas = await html2canvas(element);

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;

      const imgHeight =
        (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight
      );

      pdf.save("am38-trip-plan.pdf");

      await track("pdf");

      onExport("pdf");
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPNG = async () => {
    try {
      const element = document.getElementById("trip-content");

      if (!element) return;

      const canvas = await html2canvas(element);

      const link = document.createElement("a");

      link.download = "am38-trip.png";

      link.href = canvas.toDataURL();

      link.click();

      await track("png");

      onExport("png");
    } catch (err) {
      console.error(err);
    }
  };

  const printTrip = async () => {
    window.print();

    await track("print");

    onExport("print");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20"
    >
      <h3 className="font-bold mb-3 flex items-center gap-2 text-white">
        <Share2 size={16} />
        Share Your Trip
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => shareOnSocial("facebook")}
          className="bg-[#1877F2]/80 py-2 rounded-lg text-sm font-bold text-white hover:bg-[#1877F2] transition"
        >
          📘 Facebook
        </button>

        <button
          onClick={() => shareOnSocial("twitter")}
          className="bg-[#1DA1F2]/80 py-2 rounded-lg text-sm font-bold text-white hover:bg-[#1DA1F2] transition"
        >
          🐦 Twitter
        </button>

        <button
          onClick={() => shareOnSocial("whatsapp")}
          className="bg-[#25D366]/80 py-2 rounded-lg text-sm font-bold text-white hover:bg-[#25D366] transition"
        >
          💬 WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={exportAsPDF}
          disabled={isExporting}
          className="bg-white/20 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/30 transition flex items-center justify-center gap-1 disabled:opacity-50"
        >
          <FileText size={14} />
          {isExporting ? "Exporting..." : "PDF"}
        </button>

        <button
          onClick={printTrip}
          className="bg-white/20 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/30 transition flex items-center justify-center gap-1"
        >
          <Printer size={14} />
          Print
        </button>

        <button
          onClick={exportAsPNG}
          className="bg-white/20 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/30 transition flex items-center justify-center gap-1"
        >
          <Image size={14} />
          PNG
        </button>

        <button
          onClick={copyShareLink}
          className="bg-white/20 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/30 transition flex items-center justify-center gap-1"
        >
          {copied ? (
            <CheckCircle size={14} />
          ) : (
            <Copy size={14} />
          )}

          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      <div className="bg-white/5 rounded-xl p-3 text-xs text-white/60 mt-3">
        Share your itinerary with friends or export as professional travel plan.
      </div>
    </motion.div>
  );
}