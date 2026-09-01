import { SlidersHorizontal, Flame } from "lucide-react";

interface FilterProps {
  filter: {
    category: string;
    fuel: string;
    seats: string;
    popular: boolean;
    price: number;
  };
  onChange: (updates: Partial<FilterProps["filter"]>) => void;
  onReset: () => void;
}

const CATEGORY_OPTIONS = ["all", "Economy", "SUV", "Hybrid", "Family", "7 Seater"];
const FUEL_OPTIONS = ["all", "Petrol", "Diesel", "Hybrid", "Electric"];
const SEAT_OPTIONS = ["all", "5", "7"];

export default function CarsFilters({ filter, onChange, onReset }: FilterProps) {
  return (
    <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
        <SlidersHorizontal className="h-5 w-5" />
        Filter
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <div className="mb-3 text-sm font-medium text-white/75">Category</div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((item) => (
              <button
                key={item}
                onClick={() => onChange({ category: item })}
                className={`rounded-xl px-3 py-2 text-sm transition ${
                  filter.category === item
                    ? "bg-cyan-400 font-semibold text-black"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel Filter */}
        <div>
          <div className="mb-3 text-sm font-medium text-white/75">Fuel</div>
          <div className="flex flex-wrap gap-2">
            {FUEL_OPTIONS.map((item) => (
              <button
                key={item}
                onClick={() => onChange({ fuel: item })}
                className={`rounded-xl px-3 py-2 text-sm transition ${
                  filter.fuel === item
                    ? "bg-cyan-400 font-semibold text-black"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Seats Filter */}
        <div>
          <div className="mb-3 text-sm font-medium text-white/75">Seats</div>
          <div className="flex flex-wrap gap-2">
            {SEAT_OPTIONS.map((item) => (
              <button
                key={item}
                onClick={() => onChange({ seats: item })}
                className={`rounded-xl px-3 py-2 text-sm transition ${
                  filter.seats === item
                    ? "bg-cyan-400 font-semibold text-black"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {item === "all" ? "All" : `${item} seats`}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Only Filter */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/75">
            <Flame className="h-4 w-4 text-cyan-300" />
            Popular only
          </div>
          <button
            onClick={() => onChange({ popular: !filter.popular })}
            className={`w-full rounded-xl px-4 py-3 text-sm transition ${
              filter.popular
                ? "bg-cyan-400 font-semibold text-black"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            {filter.popular ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Price Range Slider */}
        <div>
          <div className="mb-3 text-sm font-medium text-white/75">
            Max price €{filter.price}
          </div>
          <input
            type="range"
            min={25}
            max={200}
            step={5}
            value={filter.price}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            className="w-full accent-cyan-400"
          />
          <div className="mt-2 flex justify-between text-xs text-white/50">
            <span>€25</span>
            <span>€50</span>
            <span>€100</span>
            <span>€150</span>
            <span>€200</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}