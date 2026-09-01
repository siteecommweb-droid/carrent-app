import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchItem {
  type: "car" | "place" | "page";
  label: string;
  path: string;
  icon?: string;
}

const searchData: SearchItem[] = [
  { type: "car", label: "Toyota Yaris", path: "/cars", icon: "🚗" },
  { type: "car", label: "Hyundai i10", path: "/cars", icon: "🚙" },
  { type: "car", label: "Suzuki Swift", path: "/cars", icon: "🚗" },
  { type: "car", label: "Honda CRV", path: "/cars", icon: "🚙" },
  { type: "car", label: "Nissan Note", path: "/cars", icon: "🚗" },
  { type: "place", label: "Le Morne Beach", path: "/explore", icon: "🏖️" },
  { type: "place", label: "Chamarel Waterfall", path: "/explore", icon: "🌊" },
  { type: "place", label: "Grand Baie", path: "/explore", icon: "🏝️" },
  { type: "place", label: "Port Louis Market", path: "/explore", icon: "🏛️" },
  { type: "page", label: "Support Center", path: "/support", icon: "🎫" },
  { type: "page", label: "My Bookings", path: "/my-bookings", icon: "📅" },
  { type: "page", label: "Fleet Manager", path: "/cars", icon: "🚘" },
];

const popularSearches = ["SUV rental", "Airport pickup", "Economy car", "7 seater"];

export default function SearchEngine() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (item: SearchItem) => {
    saveRecentSearch(item.label);
    navigate(item.path);
    setIsOpen(false);
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
  };

  const results = query.trim() === "" ? [] : searchData.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "car": return "bg-blue-500/20 text-blue-400";
      case "place": return "bg-green-500/20 text-green-400";
      default: return "bg-purple-500/20 text-purple-400";
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cars, places, support..."
          className="w-full pl-11 pr-12 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
          >
            {/* Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                {results.map((item, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => handleSearch(item)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition text-left"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">→</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {query.trim() === "" && recentSearches.length > 0 && (
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Clock size={12} /> Recent</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(term);
                        saveRecentSearch(term);
                        navigate("/cars");
                        setIsOpen(false);
                      }}
                      className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {query.trim() === "" && (
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><TrendingUp size={12} /> Popular</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(term);
                        saveRecentSearch(term);
                        navigate("/cars");
                        setIsOpen(false);
                      }}
                      className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && results.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Try searching for cars, destinations, or help topics</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}