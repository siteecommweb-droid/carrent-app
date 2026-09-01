import { motion } from "framer-motion";
import { CalendarDays, Car as CarIcon, Heart, Leaf, Infinity, Star, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export type CarCardData = {
  id: number;
  make: string;
  model: string;
  year: number;
  transmission: string;
  seats: number;
  daily_price: number;
  category?: string;
  fuel_type?: string;
  is_eco_friendly?: boolean;
  unlimited_km?: boolean;
  rating?: number;
  review_count?: number;
  image_url?: string;
  is_available?: boolean;
};

export function CarCard({
  car,
  highlight,
  startDate,
  endDate,
  busy,
  onChangeStart,
  onChangeEnd,
  onBook,
  onWishlist,
  isFavorited,
  currency = "MUR",
  exchangeRate = 1,
}: {
  car: CarCardData;
  highlight?: boolean;
  startDate: string;
  endDate: string;
  busy?: boolean;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onBook: () => void;
  onWishlist?: (carId: number) => void;
  isFavorited?: boolean;
  currency?: string;
  exchangeRate?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const days = (() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate + "T00:00:00").getTime();
    const e = new Date(endDate + "T00:00:00").getTime();
    if (Number.isNaN(s) || Number.isNaN(e)) return 1;
    if (e < s) {
      setDateError("End date must be after start date");
      return 0;
    }
    setDateError(null);
    return Math.max(1, Math.ceil((e - s) / 86400000));
  })();

  const convertedPrice = Math.round(Number(car.daily_price || 0) * exchangeRate);
  const estTotal = Math.round(convertedPrice * days);

  const currencySymbol = { MUR: "Rs", EUR: "€", USD: "$", GBP: "£", CAD: "C$" }[currency] || "Rs";

  const getRecommendationScore = () => {
    let score = 0;
    if (car.rating && car.rating > 4.5) score += 30;
    if (car.is_eco_friendly) score += 20;
    if (car.unlimited_km) score += 15;
    if (car.year >= 2022) score += 15;
    score += Math.floor(Math.random() * 20);
    return Math.min(score, 100);
  };

  const recommendationScore = getRecommendationScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`rounded-3xl border bg-white shadow-sm overflow-hidden transition-all duration-300 ${
        highlight ? "border-blue-400 ring-2 ring-blue-500/30 shadow-xl" : "border-black/10 hover:shadow-xl"
      }`}
    >
      {/* Gradient Header */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-white to-red-600" />

      {/* Image Section with Lazy Loading */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full" />
          </div>
        )}
        <img
          src={car.image_url || "/car-placeholder.jpg"}
          alt={`${car.make} ${car.model}`}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.is_eco_friendly && (
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Leaf className="h-3 w-3" /> Eco
            </span>
          )}
          {car.unlimited_km && (
            <span className="flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Infinity className="h-3 w-3" /> Unlimited
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        {onWishlist && (
          <button
            onClick={() => onWishlist(car.id)}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition shadow-md"
          >
            <Heart className={`h-4 w-4 transition ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        )}

        {/* Rating Badge */}
        {car.rating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{car.rating}</span>
            {car.review_count && (
              <span className="text-white/70 text-xs">({car.review_count})</span>
            )}
          </div>
        )}

        {/* Recommendation Score */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-2 py-1">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-yellow-400" />
            <span className="text-white text-xs font-bold">{recommendationScore}% match</span>
          </div>
        </div>

        {/* Availability Overlay */}
        {car.is_available === false && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold px-3 py-1 bg-red-600 rounded-full flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Not Available
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-xl font-black">
              {car.make} {car.model}
              {car.is_available === true && (
                <span className="ml-2 inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" /> Available
                </span>
              )}
            </div>
            <div className="text-xs text-black/55 mt-1 flex flex-wrap gap-2">
              <span>Car ID: {car.id}</span>
              {car.category && <span>• {car.category}</span>}
              {car.fuel_type && <span>• {car.fuel_type}</span>}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-black/55">Price/day</div>
            <div className="text-lg font-black">
              {currencySymbol} {convertedPrice.toLocaleString()}
            </div>
            <div className="text-xs text-black/40">~ {currencySymbol} {car.daily_price} MUR</div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-black/70">
          <div className="flex items-center gap-2">
            <span>Year: <span className="font-semibold text-black">{car.year}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Seats: <span className="font-semibold text-black">{car.seats}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Transmission: <span className="font-semibold text-black">{car.transmission}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span>Est total: <span className="font-black text-black">{currencySymbol} {estTotal.toLocaleString()}</span></span>
          </div>
        </div>

        {/* Date Selection with Validation */}
        <div className="mt-5 rounded-3xl border border-black/10 bg-black/[0.02] p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-black text-black/75">
            <CalendarDays className="h-4 w-4" /> Select dates
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-[11px] text-black/55 font-semibold">
              Start
              <input
                type="date"
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => onChangeStart(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="grid gap-1 text-[11px] text-black/55 font-semibold">
              End
              <input
                type="date"
                value={endDate}
                min={startDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => onChangeEnd(e.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          {dateError && (
            <div className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {dateError}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-black/55">
            <span>{days} day(s)</span>
            <span className="font-black text-black">Total: {currencySymbol} {estTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="mt-3 flex justify-center">
          <div className="bg-gray-100 rounded-xl p-2">
            <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-500">
              QR
            </div>
          </div>
        </div>

        {/* Book Button */}
        <button
          disabled={!!busy || !startDate || !endDate || !!dateError || car.is_available === false}
          onClick={onBook}
          className="mt-4 w-full rounded-2xl px-4 py-3 font-black text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          <CarIcon className="h-4 w-4" />
          {busy ? "Booking..." : !car.is_available ? "Not Available" : !startDate || !endDate ? "Select Dates" : "Book Now"}
        </button>

        {/* Analytics Tracking Pixel */}
        <div className="hidden" data-car-id={car.id} data-car-price={car.daily_price} />
      </div>
    </motion.div>
  );
}