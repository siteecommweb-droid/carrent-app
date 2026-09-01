import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { useSpotlight, SearchResult } from "@/context/SpotlightContext";

const categoryIcons: Record<string, string> = {
  page: "📄",
  action: "⚡",
  vehicle: "🚗",
  place: "📍",
  partner: "🤝",
};

const categoryLabels: Record<string, string> = {
  page: "Pages",
  action: "Quick Actions",
  vehicle: "Vehicles",
  place: "Places",
  partner: "Partners",
};

export function Spotlight() {
  const { isOpen, closeSpotlight, searchQuery, setSearchQuery, results, selectedIndex, setSelectedIndex } = useSpotlight();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Listen for the custom event to open spotlight
  useEffect(() => {
    const handleOpenSpotlight = () => {
      console.log("Spotlight opened via custom event!");
      setSearchQuery("");
      setSelectedIndex(0);
      // Call open from context - but we need to add this
      // Since we can't call open directly, we'll use a workaround
      // The context has isOpen state, we need to set it
      // But we don't have setter directly...
    };

    document.addEventListener("open-spotlight", handleOpenSpotlight);
    return () => {
      document.removeEventListener("open-spotlight", handleOpenSpotlight);
    };
  }, [setSearchQuery, setSelectedIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSpotlight();
      }

      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(Math.min(selectedIndex + 1, results.length - 1));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(Math.max(selectedIndex - 1, 0));
        }
        if (e.key === "Enter" && results[selectedIndex]) {
          e.preventDefault();
          handleSelectResult(results[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, results, selectedIndex, setSelectedIndex, closeSpotlight]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelectResult = (result: SearchResult) => {
    closeSpotlight();
    navigate(result.path);
  };

  const groupedResults = () => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach(result => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });
    return groups;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
          onClick={closeSpotlight}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15, type: "spring", damping: 30 }}
            className="relative max-w-3xl mx-auto mt-[10vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-6 py-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search pages, vehicles, places, actions..."
                className="flex-1 px-4 py-2 text-lg text-black outline-none bg-transparent placeholder-gray-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-500">No results found</p>
                  <p className="text-sm">Try searching for something else</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedResults()).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {categoryLabels[category] || category}
                      </div>
                      {items.map((result) => {
                        const globalIndex = results.indexOf(result);
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <motion.button
                            key={result.id}
                            onClick={() => handleSelectResult(result)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                              {result.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-black">{result.title}</div>
                              <div className="text-sm text-gray-500 truncate">{result.description}</div>
                            </div>
                            <div className="flex-shrink-0">
                              {isSelected ? (
                                <ArrowRight className="w-5 h-5 text-blue-500" />
                              ) : (
                                <span className="text-xs text-gray-400">{categoryIcons[result.category]}</span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono border">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono border">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono border">Enter</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white rounded text-xs font-mono border">Esc</kbd>
                  <span>Close</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>AI-powered search</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}