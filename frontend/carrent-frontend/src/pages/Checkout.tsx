import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { motion, AnimatePresence } from "framer-motion";
import { cars as fallbackCars } from "@/data/cars";
import { useBooking } from "@/context/BookingContext";
import { useCurrency } from "@/context/CurrencyContext";
import { buildPriceBreakdown, computeRentalDays } from "@/utils/booking";
import { getCarImage } from "@/utils/carImage";
import { fetchAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Shield, 
  CreditCard, 
  Smartphone, 
  Crown, 
  ArrowLeft, 
  CheckCircle,
  Car,
  Users,
  Sparkles,
  TrendingUp,
  Gift,
  Star
} from "lucide-react";

// ==================== TRANSLATIONS ====================

function getTranslation(key: string): string {
  const lang = localStorage.getItem("preferredLanguage") || "en";
  const translations: Record<string, Record<string, string>> = {
    en: {
      title: "Secure Checkout",
      noCar: "No car selected.",
      back: "Back to Cars",
      boostExperience: "✨ Boost Your Mauritius Experience",
      driver: "Private Driver",
      sim: "Tourist SIM Card",
      vip: "VIP Concierge Package",
      prepare: "📋 Prepare Booking",
      days: "Rental Days",
      base: "Base Price",
      extras: "Extras",
      saved: "💰 You save vs competitors",
      bookingReady: "✅ Booking ready for payment",
      processing: "Processing payment...",
      createBookingFirst: "Create booking to continue",
      securePayment: "Secure Payment",
      payNow: "Pay Now",
      summary: "Booking Summary",
      includes: "Includes:",
      insurance: "Full Insurance",
      support: "24/7 Support",
      delivery: "Free Airport Delivery",
      whyUs: "Why AM38?",
      trusted: "10,000+ Happy Customers",
      bestPrice: "Best Price Guarantee",
      instant: "Instant Confirmation",
      flexible: "Free Cancellation",
      total: "Total",
    },
    fr: {
      title: "Paiement Sécurisé",
      noCar: "Aucune voiture sélectionnée.",
      back: "Retour aux voitures",
      boostExperience: "✨ Améliorez votre expérience à Maurice",
      driver: "Chauffeur privé",
      sim: "Carte SIM touristique",
      vip: "Forfait VIP Conciergerie",
      prepare: "📋 Préparer la réservation",
      days: "Jours de location",
      base: "Prix de base",
      extras: "Suppléments",
      saved: "💰 Vous économisez",
      bookingReady: "✅ Réservation prête pour le paiement",
      processing: "Traitement du paiement...",
      createBookingFirst: "Créez d'abord la réservation",
      securePayment: "Paiement sécurisé",
      payNow: "Payer maintenant",
      summary: "Résumé de la réservation",
      includes: "Inclus :",
      insurance: "Assurance complète",
      support: "Support 24/7",
      delivery: "Livraison gratuite à l'aéroport",
      whyUs: "Pourquoi AM38 ?",
      trusted: "10 000+ clients satisfaits",
      bestPrice: "Garantie du meilleur prix",
      instant: "Confirmation instantanée",
      flexible: "Annulation gratuite",
      total: "Total",
    },
  };
  return translations[lang]?.[key] || translations.en[key];
}

// ==================== UPSELL CARD ====================

function UpsellCard({ label, price, description, icon: Icon, state, setState, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4 border transition-all cursor-pointer ${
        state ? "border-blue-400 bg-blue-500/20" : "border-white/20 hover:bg-white/15"
      }`}
      onClick={() => setState(!state)}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="font-bold text-lg">{label}</div>
          <div className="text-sm text-white/60">{description}</div>
          <div className="text-xs text-green-400 mt-1">{price} MUR</div>
        </div>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        state ? "bg-blue-500 border-blue-500" : "border-white/40"
      }`}>
        {state && <CheckCircle className="w-4 h-4 text-white" />}
      </div>
    </motion.div>
  );
}

// ==================== CHECKOUT FORM ====================

function CheckoutForm({ amount, bookingId, onSuccess }: { amount: number; bookingId: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    
    toast.loading("Processing payment...", { id: "payment" });
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { 
        return_url: `${window.location.origin}/booking-success?bookingId=${bookingId}` 
      },
      redirect: "if_required",
    });
    
    if (error) {
      toast.error(error.message || "Payment failed", { id: "payment" });
    } else {
      toast.success("Payment successful! Redirecting...", { id: "payment" });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
        <Shield className="w-4 h-4 text-green-400" />
        <span>🔒 PCI-DSS Compliant • Encrypted Payment</span>
      </div>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
        ) : (
          <><CreditCard className="w-5 h-5" /> {getTranslation("payNow")} • {amount.toLocaleString()} MUR</>
        )}
      </button>
    </motion.form>
  );
}

// ==================== MAIN CHECKOUT COMPONENT ====================

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const { selectedCar, bookingDraft, selectCar } = useBooking();
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [driverService, setDriverService] = useState(false);
  const [simCard, setSimCard] = useState(false);
  const [vipPackage, setVipPackage] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const carId = searchParams.get("carId");
    if (!carId) return;
    const matched = fallbackCars.find(c => String(c.id) === String(carId));
    if (matched) selectCar(matched as any);
  }, [searchParams, selectCar]);

  // Calculate days
  const days = useMemo(() => {
    if (!bookingDraft.pickupDate || !bookingDraft.dropoffDate) return 3;
    return computeRentalDays(
      bookingDraft.pickupDate, 
      bookingDraft.pickupTime || "10:00",
      bookingDraft.dropoffDate, 
      bookingDraft.dropoffTime || "10:00"
    );
  }, [bookingDraft]);

  // Calculate totals
  const dailyPrice = (selectedCar as any)?.price || (selectedCar as any)?.daily_price || 0;
  const extraTotal = (driverService ? 1500 : 0) + (simCard ? 300 : 0) + (vipPackage ? 2500 : 0);
  const grandTotal = (dailyPrice * days) + extraTotal;

  // FIXED: Create booking with correct payload
  const initBooking = async () => {
    if (!selectedCar) {
      toast.error("No car selected");
      return;
    }

    try {
      setSubmitting(true);
      toast.loading("Creating your booking...", { id: "booking" });

      const startDate = bookingDraft.pickupDate || new Date().toISOString().split("T")[0];
      const endDate = bookingDraft.dropoffDate || new Date(Date.now() + days * 86400000).toISOString().split("T")[0];

      const payload = {
        car_id: selectedCar.id,
        customer_name: bookingDraft.fullName || "Guest User",
        customer_email: bookingDraft.email || "guest@am38.com",
        customer_phone: bookingDraft.phone || "00000000",
        pickup_location: bookingDraft.pickupLocation || "SSR Airport",
        dropoff_location: bookingDraft.dropoffLocation || "SSR Airport",
        pickup_date: `${startDate} ${bookingDraft.pickupTime || "10:00"}`,
        return_date: `${endDate} ${bookingDraft.dropoffTime || "10:00"}`,
        total_amount: grandTotal,
        addons_json: {
          driverService: driverService,
          simCard: simCard,
          vipPackage: vipPackage
        },
        notes: `VIP:${vipPackage} DRIVER:${driverService} SIM:${simCard}`,
      };

      const booking = await fetchAPI("/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const bookingId = booking?.bookingId || booking?.id;

      if (!bookingId) {
        throw new Error("Booking ID missing");
      }

      toast.success("Booking created successfully", { id: "booking" });
      navigate(`/booking-success/${bookingId}`);

    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Booking failed. Please try again.", { id: "booking" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedCar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gradient-to-r from-blue-800 via-white to-red-700">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center max-w-md">
          <Car className="w-16 h-16 mx-auto mb-4 text-white/50" />
          <p className="text-white text-xl mb-4">{getTranslation("noCar")}</p>
          <Link to="/cars" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition">
            <ArrowLeft className="w-5 h-5" />
            {getTranslation("back")}
          </Link>
        </div>
      </div>
    );
  }

  const car = selectedCar;
  const carDisplayName = `${(car as any).make || "Premium"} ${(car as any).model || "Vehicle"}`;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-white to-red-700">
      {/* French Flag Gradient Header */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-white to-red-500" />
      
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN - Upsells & Payment */}
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-4xl font-black text-white">{getTranslation("title")}</h1>
                <p className="text-white/70 mt-1">Complete your booking securely</p>
              </div>
              <Link to="/cars" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition">
                <ArrowLeft className="w-4 h-4" />
                {getTranslation("back")}
              </Link>
            </motion.div>

            {/* Boost Experience Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">{getTranslation("boostExperience")}</h2>
              </div>
              <div className="space-y-3">
                <UpsellCard
                  label={getTranslation("driver")}
                  description="Local driver familiar with all island routes"
                  price="1,500"
                  icon={Users}
                  state={driverService}
                  setState={setDriverService}
                  color="bg-blue-500"
                />
                <UpsellCard
                  label={getTranslation("sim")}
                  description="30GB data + local calls + WhatsApp"
                  price="300"
                  icon={Smartphone}
                  state={simCard}
                  setState={setSimCard}
                  color="bg-green-500"
                />
                <UpsellCard
                  label={getTranslation("vip")}
                  description="Fast-track, welcome drink, premium support"
                  price="2,500"
                  icon={Crown}
                  state={vipPackage}
                  setState={setVipPackage}
                  color="bg-purple-500"
                />
              </div>
            </motion.div>

            {/* Why Choose AM38 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">{getTranslation("whyUs")}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, text: getTranslation("insurance") },
                  { icon: Clock, text: getTranslation("support") },
                  { icon: MapPin, text: getTranslation("delivery") },
                  { icon: TrendingUp, text: getTranslation("bestPrice") },
                  { icon: CheckCircle, text: getTranslation("instant") },
                  { icon: Gift, text: getTranslation("flexible") },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                    <item.icon className="w-4 h-4 text-green-400" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Booking Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={initBooking}
                disabled={submitting}
                className="w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-lg text-white hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Booking...</>
                ) : (
                  <><Calendar className="w-5 h-5" /> {getTranslation("prepare")}</>
                )}
              </button>
            </motion.div>

            {/* Trust Badges */}
            <div className="flex justify-center gap-4 text-white/60 text-xs">
              <span>🔒 SSL Secure</span>
              <span>💳 Visa/Mastercard/Amex</span>
              <span>🛡️ Fraud Protection</span>
            </div>
          </div>

          {/* RIGHT COLUMN - Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-24"
          >
            {/* Car Image */}
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img
                src={getCarImage(car)}
                className="w-full h-[200px] object-cover"
                alt={carDisplayName}
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Available
              </div>
            </div>

            {/* Car Info */}
            <h2 className="text-2xl font-black text-white mb-2">{carDisplayName}</h2>
            <div className="flex items-center gap-4 text-white/70 text-sm mb-4">
              <span className="flex items-center gap-1"><Car className="w-4 h-4" /> {(car as any).transmission || "Auto"}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {(car as any).seats || 5} seats</span>
            </div>

            {/* Rental Period */}
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Rental Period</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-white/50">Pickup</div>
                  <div className="text-white font-medium">
                    {bookingDraft.pickupDate || "Select date"}<br />
                    {bookingDraft.pickupTime || "10:00"}
                  </div>
                </div>
                <div>
                  <div className="text-white/50">Dropoff</div>
                  <div className="text-white font-medium">
                    {bookingDraft.dropoffDate || "Select date"}<br />
                    {bookingDraft.dropoffTime || "10:00"}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-white/60">{days} {getTranslation("days")}</div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-white/80">
                <span>{getTranslation("base")} ({days} days)</span>
                <span>{formatPrice(dailyPrice * days)}</span>
              </div>
              
              {(driverService || simCard || vipPackage) && (
                <div className="flex justify-between text-white/80">
                  <span>{getTranslation("extras")}</span>
                  <span>{formatPrice(extraTotal)}</span>
                </div>
              )}
              
              {driverService && (
                <div className="flex justify-between text-white/60 text-sm pl-4">
                  <span>• Private Driver</span>
                  <span>1,500 MUR</span>
                </div>
              )}
              {simCard && (
                <div className="flex justify-between text-white/60 text-sm pl-4">
                  <span>• Tourist SIM</span>
                  <span>300 MUR</span>
                </div>
              )}
              {vipPackage && (
                <div className="flex justify-between text-white/60 text-sm pl-4">
                  <span>• VIP Package</span>
                  <span>2,500 MUR</span>
                </div>
              )}
              
              <div className="border-t border-white/20 pt-3 mt-2">
                <div className="flex justify-between text-xl font-black text-white">
                  <span>{getTranslation("total").toUpperCase()}</span>
                  <span className="text-green-400">{formatPrice(grandTotal)} MUR</span>
                </div>
                <div className="text-xs text-white/50 mt-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Taxes & fees included
                </div>
              </div>
            </div>

            {/* Includes Section */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="text-white/80 text-sm font-semibold mb-2">{getTranslation("includes")}</div>
              <div className="flex flex-wrap gap-2">
                {[getTranslation("insurance"), getTranslation("support"), getTranslation("delivery")].map((item, i) => (
                  <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}