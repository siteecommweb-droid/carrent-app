import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Car,
  Star,
  Fuel,
  Users,
  Gauge,
  Calendar,
  Clock,
  Shield,
  Wifi,
  Coffee,
  CheckCircle,
  MessageCircle,
  Heart,
  Share2,
  MapPin,
  X,
  Baby,
  UserPlus,
  Smartphone,
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

type CarDetail = {
  id: number;
  brand: string;
  make: string;
  model: string;
  year: number;
  daily_price: number;
  price_per_day: number;
  seats: number;
  transmission: string;
  fuel_type: string;
  image: string;
  gallery: string[];
  rating: number;
  review_count: number;
  description: string;
  horsepower: number;
  acceleration: number;
  top_speed: number;
  features: string[];
  policies: string[];
  av_group: string;
  stock_number: string;
  color: string;
  wow_feature: string;
  is_popular: boolean;
};

const addOns = [
  { id: "child_seat", name: "Child Seat", price: 250, icon: Baby },
  { id: "gps", name: "GPS Navigation", price: 300, icon: MapPin },
  { id: "wifi", name: "WiFi Hotspot", price: 200, icon: Wifi },
  { id: "coffee", name: "Welcome Coffee", price: 150, icon: Coffee },
  { id: "driver", name: "Additional Driver", price: 500, icon: UserPlus },
  { id: "charger", name: "Phone Charger", price: 100, icon: Smartphone }
];

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { selectCar } = useBooking();
  const { isAuthenticated } = useAuth();
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [specialRequest, setSpecialRequest] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    async function fetchCar() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/cars/${id}`);
        const data = await res.json();
        const carData = data?.car || data;
        setCar(carData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load car details");
      } finally {
        setLoading(false);
      }
    }

    fetchCar();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 3);
    setPickupDate(today.toISOString().split("T")[0]);
    setReturnDate(tomorrow.toISOString().split("T")[0]);
  }, [id]);

  const toggleWishlist = () => {
    let newWishlist;
    if (wishlist.includes(Number(id))) {
      newWishlist = wishlist.filter(i => i !== Number(id));
      toast.success("Removed from wishlist");
    } else {
      newWishlist = [...wishlist, Number(id)];
      toast.success("Added to wishlist");
    }
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const calculateTotal = () => {
    if (!car) return 0;
    const days = calculateDays();
    const addOnsTotal = selectedAddOns.reduce((sum, id) => {
      const addOn = addOns.find(a => a.id === id);
      return sum + (addOn?.price || 0);
    }, 0);
    return (car.price_per_day * days) + addOnsTotal;
  };

  // ========== FIXED handleBooking (with localStorage persistence) ==========
  const handleBooking = () => {
    if (!isAuthenticated) {
      toast.error("Please login to book a car");
      navigate("/login");
      return;
    }
    if (car) {
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
        specialRequest: specialRequest,
        selectedAddOns: selectedAddOns
      };

      selectCar(carData as any);
      // Persist selected car and timestamp for login redirect
      localStorage.setItem("selectedCar", JSON.stringify(carData));
      localStorage.setItem("selectedCarTimestamp", String(Date.now()));

      navigate(`/checkout?carId=${car.id}`);
    }
  };
  // ======================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] flex items-center justify-center">
        <p className="text-black">Car not found</p>
      </div>
    );
  }

  const days = calculateDays();
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Back & Actions */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate("/cars")} className="text-red-600 hover:underline font-bold">
            ← Back to Cars
          </button>
          <div className="flex gap-3">
            <button onClick={toggleWishlist} className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition">
              <Heart className={`w-5 h-5 ${wishlist.includes(Number(id)) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-[400px] object-contain bg-gradient-to-br from-slate-100 to-slate-200 p-8"
                onError={(e) => { (e.target as HTMLImageElement).src = "/cars/vitara.jpg"; }}
              />
              {car.is_popular && (
                <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Popular
                </span>
              )}
              <span className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
                {car.av_group} • {car.stock_number}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((_, idx) => (
                <img
                  key={idx}
                  src={car.image}
                  alt={`View ${idx + 1}`}
                  className="rounded-xl w-full h-24 object-cover cursor-pointer hover:opacity-80 transition border-2 hover:border-red-500"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/cars/vitara.jpg"; }}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-black">{car.brand} {car.model}</h1>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">{car.av_group}</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{car.stock_number}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-black">{car.rating || 4.9}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{car.review_count || 156} reviews</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{car.year}</span>
              <span className="text-gray-400">•</span>
              <span className="text-green-600 font-bold">Available Now</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <Users className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs text-gray-500">Seats</p>
                  <p className="font-bold text-black">{car.seats} passengers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <Gauge className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs text-gray-500">Transmission</p>
                  <p className="font-bold text-black">{car.transmission}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <Fuel className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs text-gray-500">Fuel</p>
                  <p className="font-bold text-black">{car.fuel_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs text-gray-500">Horsepower</p>
                  <p className="font-bold text-black">{car.horsepower || 138} HP</p>
                </div>
              </div>
            </div>

            {/* Wow Feature */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-800">✨ WOW Feature</h3>
              </div>
              <p className="text-sm text-yellow-700">{car.wow_feature || "Premium Mauritius Fleet with Airport Delivery"}</p>
            </div>

            <p className="text-gray-600 mb-6">{car.description || "Experience luxury and comfort with this premium vehicle. Perfect for exploring Mauritius in style with free airport delivery and 24/7 support."}</p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-black">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features?.slice(0, 8).map((feature, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Booking Panel */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="mb-4">
                <span className="text-3xl font-black text-red-600">{formatPrice(car.price_per_day)}</span>
                <span className="text-gray-500">/day</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-xl"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Return Date</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-xl"
                    min={pickupDate}
                  />
                </div>
              </div>

              {/* Special Request */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-1">Special Request (Accessibility, Child Seat, etc.)</label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g., Wheelchair accessible, need baby seat, airport pickup assistance..."
                  className="w-full p-3 border border-gray-200 rounded-xl resize-none text-sm"
                  rows={2}
                />
              </div>

              {/* Add-ons */}
              <div className="mb-4">
                <p className="font-medium text-sm mb-2">Extra Services</p>
                <div className="grid grid-cols-2 gap-2">
                  {addOns.map(addon => (
                    <label key={addon.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <addon.icon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs">{addon.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Rs {addon.price}</span>
                        <input
                          type="checkbox"
                          checked={selectedAddOns.includes(addon.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAddOns([...selectedAddOns, addon.id]);
                            } else {
                              setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-3 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Rental ({days} days)</span>
                  <span>{formatPrice(car.price_per_day * days)}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Add-ons</span>
                    <span>{formatPrice(selectedAddOns.reduce((sum, id) => {
                      const addon = addOns.find(a => a.id === id);
                      return sum + (addon?.price || 0);
                    }, 0))}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Now
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Insurance included</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Free cancellation</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Airport delivery</span>
              </div>
            </div>

            {/* Airport Delivery Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-800">Free Airport Delivery</h3>
              </div>
              <p className="text-sm text-blue-700">Your car will be waiting at SSR International Airport arrivals. Our team meets you with a welcome sign.</p>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
          <h3 className="font-bold text-lg mb-3 text-black">Rental Policies</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Valid driving license required</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Full insurance included</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Free cancellation up to 24h</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Airport & hotel delivery included</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">Unlimited mileage</span></div>
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm">24/7 roadside assistance</span></div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-6 text-center">
          <a
            href="https://wa.me/23058357166"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition"
          >
            <MessageCircle className="w-5 h-5" />
            Questions? Contact us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}