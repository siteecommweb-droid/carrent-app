import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  Share2,
  Star,
  Users,
  Fuel,
  DoorOpen,
  Luggage,
  GaugeCircle,
  ShieldCheck,
  Camera,
  CheckCircle2,
  X,
  RotateCw,
  SlidersHorizontal,
  Sparkles,
  MessageCircle,
  Info,
  Award,
  Clock3,
  CarFront,
  MapPin,
  Calendar,
  Wifi,
  Baby,
  UserPlus,
  Smartphone,
  Coffee,
  TrendingUp,
  Plane,
  Hotel,
  Building,
  Trees,
  Church,
  ShoppingBag,
  Utensils,
  Activity,
  BadgeCheck
} from "lucide-react";

import { useBooking } from "@/context/BookingContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { fmtMUR, fmtUSD, murToUsd, useLiveRate } from "@/lib/dualCurrency";
import toast from "react-hot-toast";

type SortValue = "recommended" | "price-low" | "price-high" | "rating";

type CarItem = {
  id: number;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  daily_price: number;
  image: string;
  transmission: string;
  fuel_type: string;
  seats: number;
  doors: number;
  luggage: number;
  available: boolean;
  av_group: string;
  color: string;
  stock_number: string;
  wow_feature: string;
  rating: number;
  review_count: number;
  horsepower: number;
  is_popular: boolean;
  instant_booking: boolean;
  free_cancellation: boolean;
  features: string[];
  model_guaranteed?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// The 6 guaranteed services from the notes — shown under EVERY car
const GUARANTEED_FEATURES = [
  "🤝 Meet & Greet Service",
  "⚡ Instant Booking",
  "♾ Unlimited Mileage",
  "💳 Low / Average Deposit",
  "🚐 Free Shuttle to & from Airport",
  "⛽ Fuel Policy: Same to Same",
];

/* Twin price — MUR + USD live-synced */
function DualPrice({ mur }: { mur: number }) {
  const rate = useLiveRate();
  return (
    <div className="text-right">
      <div className="mt-1 text-5xl font-black text-red-600">{fmtMUR(mur)}</div>
      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
        ≈ {fmtUSD(murToUsd(mur, rate))} <span className="text-[10px] font-bold text-blue-400">live</span>
      </div>
    </div>
  );
}

// REAL DATABASE DATA - ALL 62 CARS FROM EXCEL
const REAL_CARS: CarItem[] = [
  { id: 1, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1200, daily_price: 1200, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "White", stock_number: "CDAV-001", wow_feature: "Airport Ready", rating: 4.8, review_count: 128, horsepower: 88, is_popular: true, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🧳 Unlimited luggage help", "🛡 Full insurance included", "📍 GPS ready vehicle", "⚡ Instant booking confirmation"] },
  { id: 2, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1200, daily_price: 1200, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Silver", stock_number: "CDAV-002", wow_feature: "Best Economy", rating: 4.7, review_count: 95, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 3, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1200, daily_price: 1200, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Black", stock_number: "CDAV-003", wow_feature: "Fuel Saver", rating: 4.6, review_count: 78, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 4, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1500, daily_price: 1500, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "White", stock_number: "EDAV-001", wow_feature: "Most Popular", rating: 4.9, review_count: 203, horsepower: 82, is_popular: true, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🧳 Unlimited luggage help", "🛡 Full insurance included", "📍 GPS ready vehicle", "⚡ Instant booking confirmation"] },
  { id: 5, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1500, daily_price: 1500, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Grey", stock_number: "EDAV-002", wow_feature: "City Driver", rating: 4.7, review_count: 156, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 6, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1500, daily_price: 1500, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Blue", stock_number: "EDAV-003", wow_feature: "Island Explorer", rating: 4.8, review_count: 189, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 7, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2200, daily_price: 2200, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "White", stock_number: "IFAR-001", wow_feature: "SUV Comfort", rating: 4.9, review_count: 234, horsepower: 138, is_popular: true, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🧳 Unlimited luggage help", "🛡 Full insurance included", "📍 GPS ready vehicle", "⚡ Instant booking confirmation"] },
  { id: 8, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2200, daily_price: 2200, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Grey", stock_number: "IFAR-002", wow_feature: "Family Choice", rating: 4.8, review_count: 198, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 9, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1800, daily_price: 1800, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Silver", stock_number: "CDAR-001", wow_feature: "Airport Favourite", rating: 4.8, review_count: 156, horsepower: 108, is_popular: true, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🛡 Full insurance included", "📍 GPS ready vehicle", "⚡ Instant booking confirmation"] },
  { id: 10, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1800, daily_price: 1800, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "White", stock_number: "CDAR-002", wow_feature: "Low Mileage", rating: 4.7, review_count: 134, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 11, brand: "Hyundai", model: "Venue", year: 2024, price_per_day: 2500, daily_price: 2500, image: "/cars/venue.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "SFAR", color: "White", stock_number: "SFAR-001", wow_feature: "Premium SUV", rating: 4.8, review_count: 167, horsepower: 150, is_popular: true, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🧳 Unlimited luggage help", "🛡 Full insurance included", "📍 GPS ready vehicle", "⚡ Instant booking confirmation"] },
  { id: 12, brand: "Hyundai", model: "Venue", year: 2024, price_per_day: 2500, daily_price: 2500, image: "/cars/venue.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "SFAR", color: "Grey", stock_number: "SFAR-002", wow_feature: "Island Touring", rating: 4.7, review_count: 145, horsepower: 150, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 13, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3000, daily_price: 3000, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "White", stock_number: "MVAR-001", wow_feature: "7 Seater", rating: 4.8, review_count: 189, horsepower: 103, is_popular: true, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🧳 Unlimited luggage help", "🛡 Full insurance included", "📍 GPS ready vehicle", "⚡ Instant booking confirmation"] },
  { id: 14, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3000, daily_price: 3000, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Silver", stock_number: "MVAR-002", wow_feature: "Family Van", rating: 4.7, review_count: 156, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 15, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1700, daily_price: 1700, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "White", stock_number: "HDAV-001", wow_feature: "Hybrid Saving", rating: 4.9, review_count: 245, horsepower: 98, is_popular: true, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🏝 Mauritius local travel support", "🛡 Full insurance included", "📍 GPS ready vehicle", "⚡ Instant booking confirmation"] },
  { id: 16, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1700, daily_price: 1700, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Blue", stock_number: "HDAV-002", wow_feature: "Eco Choice", rating: 4.8, review_count: 198, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  // CDAV 004-010
  { id: 17, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1250, daily_price: 1250, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Blue", stock_number: "CDAV-004", wow_feature: "Airport Ready", rating: 4.7, review_count: 112, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 18, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1250, daily_price: 1250, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Grey", stock_number: "CDAV-005", wow_feature: "Compact Comfort", rating: 4.6, review_count: 89, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 19, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1300, daily_price: 1300, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Red", stock_number: "CDAV-006", wow_feature: "Island Saver", rating: 4.6, review_count: 76, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 20, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1300, daily_price: 1300, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Maroon", stock_number: "CDAV-007", wow_feature: "Budget Choice", rating: 4.5, review_count: 68, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 21, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1350, daily_price: 1350, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Green", stock_number: "CDAV-008", wow_feature: "Easy Parking", rating: 4.6, review_count: 82, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 22, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1350, daily_price: 1350, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Orange", stock_number: "CDAV-009", wow_feature: "Airport Economy", rating: 4.5, review_count: 72, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 23, brand: "Toyota", model: "Vitz", year: 2024, price_per_day: 1400, daily_price: 1400, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "CDAV", color: "Yellow", stock_number: "CDAV-010", wow_feature: "Fast Pickup", rating: 4.7, review_count: 94, horsepower: 88, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  // EDAV 004-010
  { id: 24, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1550, daily_price: 1550, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Black", stock_number: "EDAV-004", wow_feature: "Premium Economy", rating: 4.8, review_count: 167, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 25, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1550, daily_price: 1550, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Silver", stock_number: "EDAV-005", wow_feature: "Smart Choice", rating: 4.7, review_count: 143, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 26, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1600, daily_price: 1600, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Red", stock_number: "EDAV-006", wow_feature: "Sport Look", rating: 4.8, review_count: 178, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 27, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1600, daily_price: 1600, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Maroon", stock_number: "EDAV-007", wow_feature: "Couple Choice", rating: 4.6, review_count: 98, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 28, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1650, daily_price: 1650, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Green", stock_number: "EDAV-008", wow_feature: "Fuel Friendly", rating: 4.7, review_count: 123, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 29, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1650, daily_price: 1650, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Orange", stock_number: "EDAV-009", wow_feature: "Holiday Ready", rating: 4.6, review_count: 87, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 30, brand: "Suzuki", model: "Swift", year: 2024, price_per_day: 1700, daily_price: 1700, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 1, available: true, av_group: "EDAV", color: "Yellow", stock_number: "EDAV-010", wow_feature: "Easy Booking", rating: 4.7, review_count: 134, horsepower: 82, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  // IFAR 003-010
  { id: 31, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2250, daily_price: 2250, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Black", stock_number: "IFAR-003", wow_feature: "Premium SUV", rating: 4.8, review_count: 156, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 32, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2250, daily_price: 2250, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Blue", stock_number: "IFAR-004", wow_feature: "Coastal Drive", rating: 4.7, review_count: 134, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 33, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2300, daily_price: 2300, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Silver", stock_number: "IFAR-005", wow_feature: "Mountain Route", rating: 4.8, review_count: 167, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 34, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2300, daily_price: 2300, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Red", stock_number: "IFAR-006", wow_feature: "Luxury Island", rating: 4.9, review_count: 189, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 35, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2350, daily_price: 2350, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Maroon", stock_number: "IFAR-007", wow_feature: "Family SUV", rating: 4.7, review_count: 145, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 36, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2350, daily_price: 2350, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Green", stock_number: "IFAR-008", wow_feature: "Adventure SUV", rating: 4.8, review_count: 156, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 37, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2400, daily_price: 2400, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Orange", stock_number: "IFAR-009", wow_feature: "Touring SUV", rating: 4.6, review_count: 98, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 38, brand: "Suzuki", model: "Vitara", year: 2024, price_per_day: 2400, daily_price: 2400, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 3, available: true, av_group: "IFAR", color: "Yellow", stock_number: "IFAR-010", wow_feature: "Island SUV", rating: 4.7, review_count: 123, horsepower: 138, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  // CDAR 003-010
  { id: 39, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1850, daily_price: 1850, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Black", stock_number: "CDAR-003", wow_feature: "Business Economy", rating: 4.8, review_count: 145, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 40, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1850, daily_price: 1850, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Blue", stock_number: "CDAR-004", wow_feature: "Smooth Drive", rating: 4.7, review_count: 123, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 41, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1900, daily_price: 1900, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Grey", stock_number: "CDAR-005", wow_feature: "Airport Ready", rating: 4.6, review_count: 98, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 42, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1900, daily_price: 1900, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Red", stock_number: "CDAR-006", wow_feature: "Executive City", rating: 4.7, review_count: 112, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 43, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1950, daily_price: 1950, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Maroon", stock_number: "CDAR-007", wow_feature: "Smart Sedan", rating: 4.8, review_count: 134, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 44, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 1950, daily_price: 1950, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Green", stock_number: "CDAR-008", wow_feature: "Comfort Sedan", rating: 4.6, review_count: 87, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 45, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 2000, daily_price: 2000, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Orange", stock_number: "CDAR-009", wow_feature: "Island Sedan", rating: 4.7, review_count: 105, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 46, brand: "Toyota", model: "Yaris", year: 2024, price_per_day: 2000, daily_price: 2000, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 5, doors: 4, luggage: 2, available: true, av_group: "CDAR", color: "Yellow", stock_number: "CDAR-010", wow_feature: "Fast Handover", rating: 4.6, review_count: 92, horsepower: 108, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  // HDAV 003-010
  { id: 47, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1750, daily_price: 1750, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Black", stock_number: "HDAV-003", wow_feature: "Fuel Saving", rating: 4.8, review_count: 167, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 48, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1750, daily_price: 1750, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Grey", stock_number: "HDAV-004", wow_feature: "Hybrid Comfort", rating: 4.7, review_count: 145, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 49, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1800, daily_price: 1800, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Silver", stock_number: "HDAV-005", wow_feature: "Eco Airport", rating: 4.8, review_count: 156, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 50, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1800, daily_price: 1800, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Red", stock_number: "HDAV-006", wow_feature: "Smart Hybrid", rating: 4.9, review_count: 178, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 51, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1850, daily_price: 1850, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Maroon", stock_number: "HDAV-007", wow_feature: "Low Fuel Cost", rating: 4.7, review_count: 123, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 52, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1850, daily_price: 1850, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Green", stock_number: "HDAV-008", wow_feature: "Eco Touring", rating: 4.8, review_count: 145, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 53, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1900, daily_price: 1900, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Orange", stock_number: "HDAV-009", wow_feature: "Hybrid Island", rating: 4.6, review_count: 98, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 54, brand: "Toyota", model: "Aqua", year: 2024, price_per_day: 1900, daily_price: 1900, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", seats: 5, doors: 4, luggage: 2, available: true, av_group: "HDAV", color: "Yellow", stock_number: "HDAV-010", wow_feature: "Green Mobility", rating: 4.7, review_count: 112, horsepower: 98, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  // MVAR 003-010
  { id: 55, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3050, daily_price: 3050, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Black", stock_number: "MVAR-003", wow_feature: "Group Travel", rating: 4.8, review_count: 145, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 56, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3050, daily_price: 3050, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Blue", stock_number: "MVAR-004", wow_feature: "Large Family", rating: 4.7, review_count: 123, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 57, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3100, daily_price: 3100, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Grey", stock_number: "MVAR-005", wow_feature: "Airport Group", rating: 4.6, review_count: 98, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 58, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3100, daily_price: 3100, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Red", stock_number: "MVAR-006", wow_feature: "Tour Group", rating: 4.8, review_count: 156, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 59, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3150, daily_price: 3150, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Maroon", stock_number: "MVAR-007", wow_feature: "Family Comfort", rating: 4.7, review_count: 134, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 60, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3150, daily_price: 3150, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Green", stock_number: "MVAR-008", wow_feature: "Big Luggage", rating: 4.6, review_count: 87, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 61, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3200, daily_price: 3200, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Orange", stock_number: "MVAR-009", wow_feature: "Group Pickup", rating: 4.7, review_count: 105, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
  { id: 62, brand: "Suzuki", model: "Ertiga", year: 2024, price_per_day: 3200, daily_price: 3200, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", seats: 7, doors: 4, luggage: 3, available: true, av_group: "MVAR", color: "Yellow", stock_number: "MVAR-010", wow_feature: "7 Seat Comfort", rating: 4.8, review_count: 167, horsepower: 103, is_popular: false, instant_booking: true, free_cancellation: true, features: ["✈ Free airport assistance", "🧳 Unlimited luggage help", "🛡 Full insurance included", "⚡ Instant booking confirmation"] },
];

function classLabel(code: string) {
  const c = code.toUpperCase();
  if (["CDAV", "CDAR", "EDAV"].includes(c)) return "Economy";
  if (["IFAR", "SFAR"].includes(c)) return "SUV";
  if (["MVAR"].includes(c)) return "7 Seater";
  if (["HDAV"].includes(c)) return "Hybrid";
  return c;
}

function calculateScore(car: CarItem) {
  return (car.is_popular ? 100 : 0) + (car.instant_booking ? 40 : 0) + (car.free_cancellation ? 30 : 0) + car.rating * 10 - car.price_per_day / 100;
}

function demandLevel(car: CarItem) {
  return Math.min(((car.id % 5) + 1) * 2, 10);
}

function viewingNow(car: CarItem) {
  return ((car.id % 7) + 5) * 3;
}

export default function Cars() {
  const navigate = useNavigate();
  const { selectCar } = useBooking();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();

  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("recommended");
  const [classFilter, setClassFilter] = useState("all");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selected360, setSelected360] = useState<CarItem | null>(null);
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<CarItem | null>(null);

  const [searchParams] = useSearchParams();
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [dropoffTime, setDropoffTime] = useState("10:00");

  useEffect(() => {
    try {
      const raw = searchParams.get("search");
      const s = raw ? JSON.parse(raw) : JSON.parse(localStorage.getItem("am38_search") || "null");
      if (s) {
        if (s.pickupDate) setPickupDate(s.pickupDate);
        if (s.dropoffDate) setDropoffDate(s.dropoffDate);
        if (s.pickupTime) setPickupTime(s.pickupTime);
        if (s.dropoffTime) setDropoffTime(s.dropoffTime);
      }
    } catch {}
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("am38_search", JSON.stringify({ pickupDate, dropoffDate, pickupTime, dropoffTime }));
  }, [pickupDate, dropoffDate, pickupTime, dropoffTime]);

  const rentalDays = useMemo(() => {
    if (!pickupDate || !dropoffDate) return 0;
    const diff = new Date(`${dropoffDate}T${dropoffTime}`).getTime() - new Date(`${pickupDate}T${pickupTime}`).getTime();
    return Math.max(1, Math.ceil(diff / 86400000));
  }, [pickupDate, dropoffDate, pickupTime, dropoffTime]);
  const datesChosen = Boolean(pickupDate && dropoffDate);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);

    async function loadCars() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/cars`);
        
        if (!res.ok) throw new Error("Cars API failed");
        
        const data = await res.json();
        const rows = Array.isArray(data) ? data : Array.isArray(data?.cars) ? data.cars : Array.isArray(data?.data) ? data.data : [];
        
        if (rows && rows.length > 0) {
          const normalized = rows.map((car: any) => ({
            id: car.id,
            brand: car.brand || car.make || "AM38",
            model: car.model || "Vehicle",
            year: car.year || 2024,
            price_per_day: Number(car.price_per_day || car.daily_price || 0),
            daily_price: Number(car.price_per_day || car.daily_price || 0),
            image: car.image ? (car.image.startsWith("/") ? car.image : `/cars/${car.image}`) : "/cars/vitara.jpg",
            transmission: car.transmission || "Automatic",
            fuel_type: car.fuel_type || "Petrol",
            seats: car.seats || 5,
            doors: car.doors || 4,
            luggage: car.luggage || 1,
            available: car.available === 1 || car.available === true || car.available === undefined,
            av_group: car.av_group || "EDAV",
            color: car.color || "White",
            stock_number: car.stock_number || `${car.av_group || "EDAV"}-${String(car.id || 1).padStart(3, "0")}`,
            wow_feature: car.wow_feature || "Premium Mauritius Fleet",
            rating: Number(car.rating || 4.7),
            review_count: Number(car.review_count || 128),
            horsepower: Number(car.horsepower || 120),
            is_popular: Boolean(car.is_popular),
            model_guaranteed: car.model_guaranteed === 0 ? false : true,
            instant_booking: true,
            free_cancellation: true,
            features: [
              "✈ Free airport assistance",
              "🏝 Mauritius local travel support",
              "🧳 Unlimited luggage help",
              "🛡 Full insurance included",
              "📍 GPS ready vehicle",
              "⚡ Instant booking confirmation"
            ]
          }));
          setCars(normalized);
        } else {
          setCars(REAL_CARS);
        }
      } catch (err) {
        console.error(err);
        setCars(REAL_CARS);
      } finally {
        setLoading(false);
      }
    }
    
    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...cars];
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((car) =>
        [car.brand, car.model, car.av_group, car.stock_number, car.color, car.wow_feature, car.fuel_type, car.transmission]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    
    if (classFilter !== "all") {
      result = result.filter((car) => car.av_group.toLowerCase() === classFilter.toLowerCase());
    }
    
    if (fuelFilter !== "all") {
      result = result.filter((car) => car.fuel_type.toLowerCase() === fuelFilter.toLowerCase());
    }
    
    result.sort((a, b) => {
      if (sortBy === "price-low") return a.price_per_day - b.price_per_day;
      if (sortBy === "price-high") return b.price_per_day - a.price_per_day;
      if (sortBy === "rating") return b.rating - a.rating;
      return calculateScore(b) - calculateScore(a);
    });
    
    return result;
  }, [cars, search, sortBy, classFilter, fuelFilter]);

  function toggleWishlist(id: number) {
    const next = wishlist.includes(id) ? wishlist.filter((x) => x !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem("wishlist", JSON.stringify(next));
    toast.success(wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist");
  }

  function shareCar(car: CarItem) {
    navigator.clipboard?.writeText(`${window.location.origin}/cars/${car.id}`);
    toast.success("Link copied!");
  }

  // ========== FIXED handleBook (with timestamp) ==========
  function handleBook(car: CarItem) {
    try {
      const carData = {
        id: car.id,
        name: `${car.brand} ${car.model}`,
        make: car.brand,
        model: car.model,
        year: car.year,
        image: car.image,
        price: car.price_per_day,
        daily_price: car.price_per_day,
        fuel_type: car.fuel_type,
        seats: car.seats,
        transmission: car.transmission,
        rating: car.rating,
        av_group: car.av_group,
        stock_number: car.stock_number,
        wow_feature: car.wow_feature,
        color: car.color,
        model_guaranteed: car.model_guaranteed !== false,
      };

      selectCar(carData as any);
      localStorage.setItem("selectedCar", JSON.stringify(carData));
      localStorage.setItem("selectedCarTimestamp", String(Date.now()));   // <--- added
      localStorage.setItem("am38_selected_car", JSON.stringify(carData));

      if (!datesChosen) {
        toast.error("Please select your rental dates first");
        document.getElementById("fleet-dates")?.scrollIntoView({ behavior: "smooth" });
        return;
      }

      // GUEST OR LOGGED-IN: both continue. Identity is captured at Driver Details
      // and saved permanently into the MySQL `reservations` table — no booking is ever lost.
      localStorage.setItem("am38_selected_car", JSON.stringify(carData));
      navigate(`/extras?carId=${car.id}`);
    } catch (error) {
      console.error("BOOK NOW ERROR:", error);
      toast.error("Booking failed. Please try again.");
    }
  }
  // ========================================================

  const openCarDetails = (car: CarItem) => {
    setSelectedCarForDetails(car);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-6 text-black font-bold text-xl">Loading AM38 Fleet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">
      <div className="mx-auto max-w-[1500px] px-4 py-8">
        
        {/* HERO SECTION */}
        <section className="rounded-[40px] border border-white/20 bg-gradient-to-r from-[#11265f] via-[#20366f] to-[#8b2638] p-8 text-white shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-black">
                <Sparkles className="h-4 w-4" />
                AM38 Mauritius Mobility
              </div>
              <h1 className="mt-6 text-5xl font-black leading-none md:text-7xl">
                Mauritius Premium
                <br />
                Car Fleet
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-white/75">
                AM38 fleet with EDAV, CDAV, IFAR, SFAR, MVAR and HDAV codes, airport delivery, instant booking and Mauritius support.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">⚡ Instant Booking</div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">🔥 Airport Delivery</div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">🛡 Fully Insured</div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">⭐ Premium Fleet</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-white/10 p-6 text-center backdrop-blur-xl"><div className="text-4xl font-black text-white">4.9/5</div><div className="mt-1 text-sm text-white/70">Google Rating</div></div>
              <div className="rounded-3xl bg-white/10 p-6 text-center backdrop-blur-xl"><div className="text-4xl font-black text-white">2023-25</div><div className="mt-1 text-sm text-white/70">Award Winner</div></div>
              <div className="rounded-3xl bg-white/10 p-6 text-center backdrop-blur-xl"><div className="text-4xl font-black text-white">{cars.length}+</div><div className="mt-1 text-sm text-white/70">Fleet Cars</div></div>
              <div className="rounded-3xl bg-white/10 p-6 text-center backdrop-blur-xl"><div className="text-4xl font-black text-white">24/7</div><div className="mt-1 text-sm text-white/70">Support</div></div>
            </div>
          </div>
        </section>

        {/* STATS ROW */}
        <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-3xl bg-white p-5 text-center shadow-lg"><Star className="mx-auto mb-2 h-8 w-8 text-yellow-500" /><div className="text-3xl font-black text-black">4.9/5</div><div className="text-xs font-semibold text-slate-500">Google Rating</div></div>
          <div className="rounded-3xl bg-white p-5 text-center shadow-lg"><Users className="mx-auto mb-2 h-8 w-8 text-blue-500" /><div className="text-3xl font-black text-black">150K+</div><div className="text-xs font-semibold text-slate-500">Happy Customers</div></div>
          <div className="rounded-3xl bg-white p-5 text-center shadow-lg"><CarFront className="mx-auto mb-2 h-8 w-8 text-red-500" /><div className="text-3xl font-black text-black">{cars.length}</div><div className="text-xs font-semibold text-slate-500">Fleet Size</div></div>
          <div className="rounded-3xl bg-white p-5 text-center shadow-lg"><Clock3 className="mx-auto mb-2 h-8 w-8 text-green-500" /><div className="text-3xl font-black text-black">24/7</div><div className="text-xs font-semibold text-slate-500">Support</div></div>
          <div className="rounded-3xl bg-white p-5 text-center shadow-lg"><Award className="mx-auto mb-2 h-8 w-8 text-purple-500" /><div className="text-3xl font-black text-black">2023-25</div><div className="text-xs font-semibold text-slate-500">Award Winner</div></div>
        </section>

        {/* MAURITIUS TRAVEL GUIDE SECTION */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="text-2xl font-black text-black mb-4 flex items-center gap-2"><Activity className="h-6 w-6 text-red-500" /> Plan Your Mauritius Trip</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { icon: Plane, name: "Airport", color: "text-blue-500" },
              { icon: Hotel, name: "Hotels", color: "text-red-500" },
              { icon: Building, name: "Hospitals", color: "text-green-500" },
              { icon: Trees, name: "Gardens", color: "text-emerald-500" },
              { icon: Church, name: "Monuments", color: "text-purple-500" },
              { icon: ShoppingBag, name: "Malls", color: "text-pink-500" },
              { icon: Utensils, name: "Restaurants", color: "text-orange-500" },
              { icon: MapPin, name: "Attractions", color: "text-cyan-500" }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50 p-3 text-center cursor-pointer hover:bg-slate-100 transition">
                <item.icon className={`mx-auto h-6 w-6 ${item.color} mb-2`} />
                <span className="text-xs font-semibold text-black">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">📱 Scan QR code in your account to access full Mauritius travel guide, beaches, coastal roads, police stations, hospitals, and plan your complete road trip itinerary.</p>
          </div>
        </section>

        {/* RENTAL DATES — cars totals follow the dates the customer selects */}
        <section id="fleet-dates" className="mt-6 rounded-3xl bg-white p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="font-black text-black">Your Rental Dates</h2>
            {datesChosen && <span className="ml-auto rounded-full bg-green-100 px-4 py-1.5 text-sm font-black text-green-700">✅ {rentalDays} day{rentalDays > 1 ? "s" : ""}</span>}
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Pick-up date</label><input type="date" value={pickupDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setPickupDate(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-black" /></div>
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Pick-up time</label><input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-black" /></div>
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Drop-off date</label><input type="date" value={dropoffDate} min={pickupDate} onChange={(e) => setDropoffDate(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-black" /></div>
            <div><label className="text-xs font-bold text-slate-500 block mb-1">Drop-off time</label><input type="time" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-black" /></div>
          </div>
          {!datesChosen && <p className="mt-3 text-sm font-bold text-orange-600">⚠ Select dates to see your total price and press Book Now.</p>}
        </section>

        {/* SEARCH & FILTERS */}
        <section className="mt-6 rounded-3xl bg-white p-4 shadow-xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px]">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vehicles, EDAV, CDAV, IFAR, SFAR, Suzuki, Toyota..." className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-4 text-black outline-none focus:border-blue-500" />
            </div>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-black">
              <option value="all">All Classes</option>
              <option value="CDAV">CDAV - Economy</option>
              <option value="CDAR">CDAR - Economy</option>
              <option value="EDAV">EDAV - Economy</option>
              <option value="IFAR">IFAR - SUV</option>
              <option value="SFAR">SFAR - Premium SUV</option>
              <option value="MVAR">MVAR - 7 Seater</option>
              <option value="HDAV">HDAV - Hybrid</option>
            </select>
            <select value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)} className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-black">
              <option value="all">All Fuel</option>
              <option value="petrol">Petrol</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortValue)} className="h-14 rounded-2xl border border-slate-200 bg-white px-4 text-black">
              <option value="recommended">Smart ranking</option>
              <option value="price-low">Lowest price</option>
              <option value="price-high">Highest price</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </section>

        {/* COUNT */}
        <div className="mt-6 flex items-center justify-between">
          <p className="font-black text-black">{filteredCars.length} vehicles available</p>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-700"><SlidersHorizontal className="h-4 w-4" />Live Fleet</div>
        </div>

        {/* CARS GRID */}
        <div className="mt-6 space-y-6 pb-20">
          <AnimatePresence>
            {filteredCars.map((car, index) => {
              const wished = wishlist.includes(car.id);
              const demand = demandLevel(car);
              const viewers = viewingNow(car);
              
              return (
                <motion.article key={car.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ delay: index * 0.03 }} className="overflow-hidden rounded-[35px] bg-white shadow-2xl hover:shadow-3xl transition-all duration-300">
                  <div className="grid lg:grid-cols-[310px_1fr_285px]">
                    
                    {/* IMAGE SECTION */}
                    <div className="p-6">
                      <div className="relative flex h-[250px] items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f5f7fb] to-[#e9edf6] group cursor-pointer" onClick={() => openCarDetails(car)}>
                        <img src={car.image} alt={`${car.brand} ${car.model}`} className="max-h-[210px] max-w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/cars/vitara.jpg"; }} />
                        {car.is_popular && <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">🔥 Popular</span>}
                        {(car as any).model_guaranteed !== false && (
                          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700"><BadgeCheck className="h-3.5 w-3.5" /> Car model guaranteed</span>
                        )}
                        <span className="absolute bottom-4 left-4 rounded-full bg-black px-4 py-2 text-xs font-black text-white">{car.av_group}</span>
                        <button onClick={(e) => { e.stopPropagation(); setSelected360(car); }} className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 text-xs font-black text-white hover:bg-black transition"><RotateCw className="h-3 w-3" />360° View</button>
                      </div>
                    </div>
                    
                    {/* DETAILS SECTION */}
                    <div className="border-r border-slate-100 p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-4xl font-black text-black cursor-pointer hover:text-red-600 transition" onClick={() => openCarDetails(car)}>{car.brand} {car.model}</h2>
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">Class: {classLabel(car.av_group)}</span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">#{car.stock_number}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{car.color}</span>
                      </div>
                      <p className="mt-2 text-slate-500">{car.av_group} • {car.transmission} • {car.fuel_type} • {car.year}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">⚡ Instant booking</span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">✅ Free cancellation</span>
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-700">{car.wow_feature}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm font-bold text-green-600"><span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />Only {demand} left • {viewers} viewing now</div>
                      
                      {/* SPECS */}
                      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                        <div className="rounded-2xl bg-[#f7f8fc] p-3 text-center"><Users className="mx-auto mb-2 h-5 w-5 text-cyan-600" /><div className="text-sm font-black text-black">{car.seats}</div><div className="text-[11px] font-semibold text-slate-500">Seats</div></div>
                        <div className="rounded-2xl bg-[#f7f8fc] p-3 text-center"><DoorOpen className="mx-auto mb-2 h-5 w-5 text-red-500" /><div className="text-sm font-black text-black">{car.doors}</div><div className="text-[11px] font-semibold text-slate-500">Doors</div></div>
                        <div className="rounded-2xl bg-[#f7f8fc] p-3 text-center"><Luggage className="mx-auto mb-2 h-5 w-5 text-yellow-500" /><div className="text-sm font-black text-black">{car.luggage}</div><div className="text-[11px] font-semibold text-slate-500">Bags</div></div>
                        <div className="rounded-2xl bg-[#f7f8fc] p-3 text-center"><Fuel className="mx-auto mb-2 h-5 w-5 text-green-500" /><div className="text-sm font-black text-black">{car.fuel_type}</div><div className="text-[11px] font-semibold text-slate-500">Fuel</div></div>
                        <div className="rounded-2xl bg-[#f7f8fc] p-3 text-center"><GaugeCircle className="mx-auto mb-2 h-5 w-5 text-purple-500" /><div className="text-sm font-black text-black">{car.horsepower}</div><div className="text-[11px] font-semibold text-slate-500">HP</div></div>
                      </div>
                      
                      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm"><span className="font-black text-black">⭐ {car.rating}</span><span className="text-slate-400">({car.review_count} customers)</span><span className="font-bold text-green-600">98% Satisfaction rate</span></div>
                      
                      {/* FEATURES */}
                      <div className="mt-5 grid gap-2 border-t border-slate-100 pt-5 md:grid-cols-2">
                        {car.features.map((feature) => (<div key={feature} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="h-4 w-4 text-green-500" />{feature}</div>))}
                      </div>
                      
                      {/* GUARANTEED WITH EVERY AM38 CAR */}
                      <div className="mt-4 rounded-2xl bg-green-50 border border-green-200 p-4">
                        <p className="text-xs font-black text-green-800 mb-2">✅ GUARANTEED WITH EVERY AM38 CAR</p>
                        <div className="grid gap-1.5 md:grid-cols-2">
                          {GUARANTEED_FEATURES.map((f) => (
                            <div key={f} className="flex items-center gap-2 text-sm font-semibold text-green-900"><CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />{f}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* PRICE & ACTIONS */}
                    <div className="flex flex-col justify-between p-6">
                      <div className="text-right">
                        <div className="text-sm text-slate-400">per day</div>
                        <DualPrice mur={car.price_per_day} />
                        {datesChosen && (
                          <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-right">
                            <div className="text-xs font-bold text-slate-500">Total for {rentalDays} days</div>
                            <div className="text-2xl font-black text-black">{fmtMUR(car.price_per_day * rentalDays)} <span className="text-sm font-black text-blue-700">≈ {fmtUSD(murToUsd(car.price_per_day * rentalDays))}</span></div>
                          </div>
                        )}
                        <div className="mt-1 text-xs text-slate-400">taxes & fees included</div>
                      </div>
                      <div className="mt-8 space-y-4">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => toggleWishlist(car.id)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 hover:bg-red-50 transition"><Heart className={`h-5 w-5 ${wished ? "fill-red-500 text-red-500" : "text-slate-500"}`} /></button>
                          <button onClick={() => shareCar(car)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 hover:bg-blue-50 transition"><Share2 className="h-5 w-5 text-slate-500" /></button>
                          <button onClick={() => openCarDetails(car)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 transition"><Info className="h-5 w-5 text-slate-500" /></button>
                        </div>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBook(car); }} className="h-14 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-lg font-black text-white shadow-xl transition hover:scale-[1.02] hover:from-red-700 hover:to-red-800 active:scale-[0.99]">Book now</button>
                        <button onClick={() => openCarDetails(car)} className="h-14 w-full rounded-2xl border-2 border-slate-200 font-black text-black transition hover:bg-slate-50">View Details</button>
                        <button onClick={() => window.open(`https://wa.me/23058357166?text=Hello AM38, I want to reserve ${car.brand} ${car.model} ${car.stock_number}`, "_blank")} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-green-500 font-black text-white shadow-xl transition hover:bg-green-600"><MessageCircle className="h-5 w-5" />WhatsApp Reservation</button>
                        <button onClick={() => setSelected360(car)} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 font-black text-white transition hover:bg-black"><Camera className="h-5 w-5" />360° Virtual Visit</button>
                      </div>
                      <div className="mt-6 text-center text-xs font-semibold text-slate-400">✓ Free cancellation • ✓ Insurance included</div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* 360 MODAL */}
      {selected360 && <Car360Modal car={selected360} onClose={() => setSelected360(null)} />}
      
      {/* DETAILS MODAL - FIXED WITH VISIBLE TEXT */}
      {selectedCarForDetails && <CarDetailsModal car={selectedCarForDetails} onClose={() => setSelectedCarForDetails(null)} formatPrice={formatPrice} handleBook={handleBook} />}
    </div>
  );
}

// ============================================================
// 360 MODAL
// ============================================================
function Car360Modal({ car, onClose }: { car: CarItem; onClose: () => void }) {
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(true);
  
  useEffect(() => {
    if (!isRotating) return;
    const id = setInterval(() => setRotation((r) => (r + 4) % 360), 70);
    return () => clearInterval(id);
  }, [isRotating]);
  
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4 backdrop-blur" onClick={onClose}>
      <div className="relative w-full max-w-5xl rounded-[32px] bg-gradient-to-br from-slate-900 to-black p-8 text-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/10 p-3 hover:bg-white/20"><X className="h-5 w-5" /></button>
        <div className="flex justify-between items-center mb-4"><h2 className="text-3xl font-black">{car.brand} {car.model} — 360° Virtual Visit</h2><button onClick={() => setIsRotating(!isRotating)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20">{isRotating ? "⏸ Pause" : "▶ Play"}</button></div>
        <div className="mt-4 flex h-[420px] items-center justify-center rounded-[28px] bg-white/5">
          <motion.img src={car.image} alt={`${car.brand} ${car.model}`} animate={{ rotateY: rotation }} transition={{ duration: 0, ease: "linear" }} className="max-h-[350px] max-w-full object-contain drop-shadow-2xl" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/cars/vitara.jpg"; }} />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center md:grid-cols-5">
          <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-bold">{car.av_group}</div><div className="text-xs opacity-70">Class</div></div>
          <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-bold">{car.stock_number}</div><div className="text-xs opacity-70">Stock</div></div>
          <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-bold">{car.seats}</div><div className="text-xs opacity-70">Seats</div></div>
          <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-bold">{car.horsepower}</div><div className="text-xs opacity-70">HP</div></div>
          <div className="rounded-2xl bg-white/10 p-4"><div className="text-2xl font-bold">{car.fuel_type}</div><div className="text-xs opacity-70">Fuel</div></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAILS MODAL - FULLY FIXED WITH VISIBLE TEXT
// ============================================================
function CarDetailsModal({ car, onClose, formatPrice, handleBook }: { car: CarItem; onClose: () => void; formatPrice: (price: number) => string; handleBook: (car: CarItem) => void }) {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 3);
    setPickupDate(today.toISOString().split("T")[0]);
    setReturnDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const calculateTotal = () => {
    const days = calculateDays();
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const prices: Record<string, number> = { child_seat: 250, gps: 300, wifi: 200, coffee: 150, driver: 500, charger: 100 };
      return sum + (prices[id] || 0);
    }, 0);
    return (car.price_per_day * days) + addOnsTotal;
  };

  const handleLocalBooking = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleBook(car);
    }, 1500);
  };

  const addonsList = [
    { id: "child_seat", name: "Child Seat", price: 250, icon: Baby },
    { id: "gps", name: "GPS Navigation", price: 300, icon: MapPin },
    { id: "wifi", name: "WiFi Hotspot", price: 200, icon: Wifi },
    { id: "coffee", name: "Welcome Coffee", price: 150, icon: Coffee },
    { id: "driver", name: "Additional Driver", price: 500, icon: UserPlus },
    { id: "charger", name: "Phone Charger", price: 100, icon: Smartphone }
  ];

  const days = calculateDays();
  const total = calculateTotal();

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur overflow-auto" onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-[32px] bg-white p-6 shadow-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-slate-100 p-2 hover:bg-slate-200"><X className="h-5 w-5" /></button>
        
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/50">
            <div className="bg-green-500 text-white px-6 py-4 rounded-2xl text-center">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2" />
              <p className="font-bold">Processing booking...</p>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div><img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full rounded-2xl object-contain bg-slate-100 p-4" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/cars/vitara.jpg"; }} /></div>
          <div>
            <h2 className="text-4xl font-black text-black">{car.brand} {car.model}</h2>
            <div className="mt-2 flex gap-2 flex-wrap"><span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">{car.av_group}</span><span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{car.stock_number}</span><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">{car.year}</span></div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2"><Users className="h-5 w-5 text-cyan-600" /><span className="text-black font-medium">{car.seats} Seats</span></div>
              <div className="flex items-center gap-2"><Fuel className="h-5 w-5 text-green-600" /><span className="text-black font-medium">{car.fuel_type}</span></div>
              <div className="flex items-center gap-2"><GaugeCircle className="h-5 w-5 text-purple-600" /><span className="text-black font-medium">{car.transmission}</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-blue-600" /><span className="text-black font-medium">Airport Delivery</span></div>
              <div className="flex items-center gap-2 col-span-2"><ShieldCheck className="h-5 w-5 text-green-600" /><span className="text-black font-medium">Color: {car.color}</span></div>
            </div>
            
            {/* Date Picker - FIXED VISIBLE TEXT */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Pickup Date</label>
                <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-xl text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Return Date</label>
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-xl text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min={pickupDate} />
              </div>
            </div>
            
            {/* Add-ons - FIXED VISIBLE TEXT */}
            <div className="mt-4">
              <h3 className="font-bold text-sm text-black mb-2">Extra Services</h3>
              <div className="grid grid-cols-2 gap-2">
                {addonsList.map(addon => (
                  <label key={addon.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg cursor-pointer text-sm text-black hover:bg-slate-100 transition">
                    <addon.icon className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{addon.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">Rs {addon.price}</span>
                    <input type="checkbox" checked={selectedAddOns.includes(addon.id)} onChange={(e) => {
                      if (e.target.checked) setSelectedAddOns([...selectedAddOns, addon.id]);
                      else setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id));
                    }} className="w-4 h-4 accent-blue-600" />
                  </label>
                ))}
              </div>
            </div>
            
            {/* Special Request - FIXED VISIBLE TEXT */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-700 block mb-1">Special Request</label>
              <textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} placeholder="Accessibility, baby seat, airport pickup details..." className="w-full p-2.5 border border-gray-300 rounded-xl text-sm text-black bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={2} />
            </div>
            
            {/* Total - FIXED VISIBLE */}
            <div className="mt-4 p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white">
              <div className="flex justify-between text-sm"><span>Rental ({days} days)</span><span>Rs {(car.price_per_day * days).toLocaleString()}</span></div>
              {selectedAddOns.length > 0 && <div className="flex justify-between text-sm mt-1"><span>Add-ons</span><span>Rs {(selectedAddOns.reduce((sum, id) => sum + (addonsList.find(a => a.id === id)?.price || 0), 0)).toLocaleString()}</span></div>}
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-white/30"><span>Total</span><span>Rs {total.toLocaleString()}</span></div>
            </div>
            
            <button onClick={handleLocalBooking} className="mt-4 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-700 py-3.5 font-black text-white hover:from-red-700 hover:to-red-800 transition text-lg shadow-xl">BOOK NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
}