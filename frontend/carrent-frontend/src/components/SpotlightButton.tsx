import { Search } from "lucide-react";
import { useSpotlight } from "@/context/SpotlightContext";

export function SpotlightButton() {
  const { openSpotlight } = useSpotlight();

  return (
    <button
      onClick={openSpotlight}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg"
      aria-label="Open Spotlight Search"
    >
      <Search className="w-5 h-5 text-white" />
      <span className="text-sm font-medium text-white hidden md:inline">Search</span>
    </button>
  );
}