import { useState } from "react";
import { Search, Sparkles, Filter, X } from "lucide-react";

interface Car {
  id: number;
  name: string;
  category: string;
  fuel: string;
  price_per_day: number;
  image?: string;
  transmission?: string;
  seats?: number;
}

export default function SmartFinder({ cars = [] }: { cars?: Car[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Car[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFuel, setSelectedFuel] = useState<string>("all");

  const categories = ["all", "Economy", "Compact", "SUV", "Premium", "Luxury", "Electric"];
  const fuelTypes = ["all", "Petrol", "Diesel", "Electric", "Hybrid"];

  function runAI() {
    if (!query.trim() && selectedCategory === "all" && selectedFuel === "all") {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const q = query.toLowerCase();
      
      const filtered = cars.filter((car: Car) => {
        const matchesQuery = !q || 
          car.name.toLowerCase().includes(q) ||
          car.category.toLowerCase().includes(q) ||
          car.fuel.toLowerCase().includes(q);
        
        const matchesCategory = selectedCategory === "all" || 
          car.category.toLowerCase() === selectedCategory.toLowerCase();
        
        const matchesFuel = selectedFuel === "all" || 
          car.fuel.toLowerCase() === selectedFuel.toLowerCase();
        
        return matchesQuery && matchesCategory && matchesFuel;
      });
      
      setResults(filtered);
      setIsSearching(false);
    }, 300);
  }

  function clearFilters() {
    setQuery("");
    setSelectedCategory("all");
    setSelectedFuel("all");
    setResults([]);
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-lg font-bold">AI Smart Finder</h3>
          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
        </div>
        <p className="text-purple-200 text-sm mt-1">Find your perfect car with intelligent search</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runAI()}
            placeholder="Search by name, category, or fuel type..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Vehicle Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Fuel Type</label>
            <div className="flex flex-wrap gap-2">
              {fuelTypes.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => setSelectedFuel(fuel)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedFuel === fuel
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={runAI}
            disabled={isSearching}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Find My Car
              </>
            )}
          </button>
          
          {(query || selectedCategory !== "all" || selectedFuel !== "all") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        {results.length > 0 && (
          <div className="text-sm text-gray-500 pt-2 border-t">
            Found {results.length} car{results.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Results Grid */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((car: Car) => (
            <div
              key={car.id}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all bg-white group cursor-pointer"
              onClick={() => window.location.href = `/cars/${car.id}`}
            >
              <div className="flex items-center gap-4">
                {car.image && (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition">
                    {car.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {car.category}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {car.fuel}
                    </span>
                    {car.transmission && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {car.transmission}
                      </span>
                    )}
                    {car.seats && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {car.seats} seats
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-purple-600">
                    Rs {car.price_per_day.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">per day</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {results.length === 0 && query && !isSearching && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No cars found matching "{query}"</p>
            <p className="text-sm mt-1">Try different keywords or clear filters</p>
          </div>
        )}

        {/* Initial State */}
        {results.length === 0 && !query && !isSearching && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Enter a search term or use filters to find your perfect car</p>
            <p className="text-sm mt-1">Example: "SUV", "Electric", "Toyota"</p>
          </div>
        )}
      </div>
    </div>
  );
}