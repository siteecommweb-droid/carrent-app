import { MessageCircle, Headset } from "lucide-react";

export default function FloatingActions() {
  return (
    <>
      <a
        href="https://wa.me/2300000000"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-2xl transition hover:scale-[1.02]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </a>

      <button
        type="button"
        className="fixed bottom-20 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-2xl transition hover:bg-slate-50"
      >
        <Headset className="h-4 w-4 text-[#165db8]" />
        Need help?
      </button>
    </>
  );
}








