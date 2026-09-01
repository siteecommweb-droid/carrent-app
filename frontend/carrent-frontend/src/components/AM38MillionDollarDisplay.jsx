import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Car, Fuel, MapPin, Calendar, User, Star, Gift, Trophy,
  ChevronRight, Heart, Share2, Camera, Clock, Phone, Mail,
  Sparkles, Zap, Crown, Diamond, Rocket, Globe, Compass,
  Coffee, Beer, Flower, Sun, Moon, Cloud, Wind, Thermometer
} from 'lucide-react';

// ============================================================
// PARTICLES BACKGROUND (3D Star)
// ============================================================
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.5, 0.1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// 3D CARD COMPONENT (Hover rotate)
// ============================================================
const CarCard3D = ({ car, onSelect, isSelected }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });
  
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (e.clientX - centerX) / rect.width;
    const moveY = (e.clientY - centerY) / rect.height;
    x.set(moveX);
    y.set(moveY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className={`
        relative rounded-3xl p-6 cursor-pointer
        ${isSelected 
          ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600' 
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
        }
        shadow-2xl border border-white/20 backdrop-blur-sm
        transition-all duration-300
      `}
      onClick={() => onSelect(car)}
    >
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      {/* Car icon with floating animation */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="text-6xl mb-4"
      >
        {car.icon}
      </motion.div>
      
      <h3 className="text-2xl font-bold">{car.name}</h3>
      
      <div className="flex items-center gap-2 mt-2">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm">{car.rating}</span>
        <span className="text-gray-400 text-sm">({car.reviews} reviews)</span>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-300">
          <User className="w-4 h-4" /> <span className="text-sm">{car.seats} seats</span>
          <Car className="w-4 h-4 ml-3" /> <span className="text-sm">{car.transmission}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-yellow-400">${car.price}</span>
          <span className="text-gray-400 text-sm">/day</span>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// FUEL CALCULATOR 3D
// ============================================================
const FuelCalculator3D = ({ totalKm, onCalculate }) => {
  const [distance, setDistance] = useState(0);
  const [fuelCost, setFuelCost] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const fuelPrice = 65; // per litre
  const avgConsumption = 8; // L/100km
  
  const calculate = () => {
    const litres = (distance * avgConsumption) / 100;
    const cost = litres * fuelPrice;
    setFuelCost(cost);
    onCalculate?.(cost);
  };
  
  return (
    <motion.div
      animate={{
        rotateX: isHovered ? 5 : 0,
        rotateY: isHovered ? 5 : 0,
        scale: isHovered ? 1.02 : 1
      }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black/50 
                 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
    >
      <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Fuel className="w-5 h-5 text-green-400" />
        Fuel Estimator 3D
      </h3>
      
      <div className="relative">
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          placeholder="Distance (km)"
          className="w-full p-3 rounded-xl bg-black/50 text-white border border-white/20 
                     focus:border-green-400 transition-all"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={calculate}
          className="mt-3 w-full bg-gradient-to-r from-green-500 to-emerald-600 
                     py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" /> Calculate
        </motion.button>
        
        {fuelCost > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white/10 rounded-xl text-center"
          >
            <p className="text-sm text-gray-300">Estimated Fuel Cost</p>
            <p className="text-3xl font-bold text-green-400">{Math.round(fuelCost)}</p>
            <p className="text-xs text-gray-400">Based on {avgConsumption}L/100km at {fuelPrice}/L</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================
// COUNTDOWN TIMER (LIVE CLOCK)
// ============================================================
const LiveCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now
    
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (86400000)) / (3600000)),
        minutes: Math.floor((difference % (3600000)) / (60000)),
        seconds: Math.floor((difference % (60000)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-3xl p-6 text-center">
      <h3 className="text-sm uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
        <Trophy className="w-4 h-4" /> Early Bird Special Ends In
      </h3>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-black bg-black/50 rounded-xl p-2 min-w-[60px]">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1">DAYS</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black bg-black/50 rounded-xl p-2 min-w-[60px]">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1">hours</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black bg-black/50 rounded-xl p-2 min-w-[60px]">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1">MINS</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black bg-black/50 rounded-xl p-2 min-w-[60px]">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1">SECS</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TESTIMONIAL CARDS WITH 3D
// ============================================================
const TestimonialCard = ({ name, country, text, image, rating }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <motion.div
      className="relative w-full h-64 cursor-pointer perspective-1000"
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 w-full h-full [backface-visibility:hidden]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xl">
              {image}
            </div>
            <div>
              <h4 className="font-bold">{name}</h4>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-300 line-clamp-4">{text}</p>
          <div className="absolute bottom-3 right-3 text-2xl">🇲🇺</div>
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-800 rounded-2xl p-5 
                       [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col items-center justify-center">
          <Heart className="w-10 h-10 text-red-400 mb-2" />
          <p className="text-center text-sm">"{text.slice(0, 80)}..."</p>
          <button className="mt-4 text-xs bg-white/20 px-4 py-2 rounded-full">
            Read full story
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AM38MillionDollarDisplay() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [tripKm, setTripKm] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  
  const cars = [
    { id: 1, name: "Tesla Model 3", icon: "🚗", rating: 4.9, reviews: 234, seats: 5, transmission: "Auto", price: 89, fuelType: "Electric" },
    { id: 2, name: "BMW X5", icon: "🚙", rating: 4.8, reviews: 189, seats: 5, transmission: "Auto", price: 120, fuelType: "Diesel" },
    { id: 3, name: "Toyota Corolla", icon: "🚘", rating: 4.7, reviews: 456, seats: 5, transmission: "Manual", price: 45, fuelType: "Petrol" },
    { id: 4, name: "Mercedes S-Class", icon: "🚖", rating: 4.9, reviews: 167, seats: 4, transmission: "Auto", price: 199, fuelType: "Petrol" },
    { id: 5, name: "Hyundai i10", icon: "🚗", rating: 4.6, reviews: 789, seats: 4, transmission: "Manual", price: 35, fuelType: "Petrol" }
  ];
  
  const qrPayload = JSON.stringify({
    brand: "AM38 Rent a Car",
    car: selectedCar?.name,
    totalKm: tripKm,
    fuelCost: (tripKm * 8 * 65) / 100,
    bookingId: Math.random().toString(36).substr(2, 8)
  });
  
  const handleBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      alert(`🎉 Booking confirmed! Check your email for confirmation.\nQR Code ready for mobile access.`);
      setIsBooking(false);
      setShowQR(true);
    }, 2000);
  };
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-purple-900/30 to-black overflow-x-hidden">
      <ParticleBackground />
      
      {/* Main content - NO CONFLICT with other files */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Header with animated gradient */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            animate={{ 
              textShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 20px rgba(0,255,255,0.5)",
                "0 0 0px rgba(255,255,255,0)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r 
                       from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            AM38 EXPLORE
          </motion.h1>
          <p className="text-xl text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Search • Plan • Travel • Book • Share
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </p>
        </motion.div>
        
        {/* 3D cars Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-400" />
            Our Premium Fleet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {cars.map(car => (
              <CarCard3D
                key={car.id}
                car={car}
                isSelected={selectedCar?.id === car.id}
                onSelect={setSelectedCar}
              />
            ))}
          </div>
        </div>
        
        {/* Two columns: Fuel Calc + Live Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <FuelCalculator3D totalKm={tripKm} onCalculate={setTripKm} />
          <LiveCountdown />
        </div>
        
        {/* Testimonials with 3D flip */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400" />
            What Our Drivers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TestimonialCard 
              name="Emma & Lucas" 
              country="France" 
              text="Best car rental experience in Mauritius! The Tesla was amazing for exploring the island. Will definitely come back!"
              image="🇫🇷"
              rating={5}
            />
            <TestimonialCard 
              name="Priya & Family" 
              country="India" 
              text="The 7-seater was perfect for our family trip. Professional service and great prices!"
              image="🇮🇳"
              rating={5}
            />
            <TestimonialCard 
              name="Chen Wei" 
              country="China" 
              text="Clean cars, easy pickup at airport. The GPS included saved us so much time!"
              image="🇨🇳"
              rating={4}
            />
          </div>
        </div>
        
        {/* Booking section with QR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 
                     border border-white/20 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold mb-2">
                {selectedCar ? `Ready to drive the ${selectedCar.name}?` : "Select a car to start"}
              </h3>
              <p className="text-gray-400">
                {selectedCar 
                  ? `Only ${selectedCar.price} USD/day • ${selectedCar.transmission} • ${selectedCar.seats} seats`
                  : "Choose your perfect ride from our premium fleet above"
                }
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedCar || isBooking}
              onClick={handleBooking}
              className={`
                px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-2
                ${selectedCar 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-2xl hover:shadow-green-500/30' 
                  : 'bg-gray-700 cursor-not-allowed'
                }
                transition-all duration-300
              `}
            >
              {isBooking ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  🚀 Book Now
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
          
          {/* QR Code Section */}
          <AnimatePresence>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/20"
              >
                <div className="flex flex-col items-center gap-4">
                  <h4 className="text-xl font-bold flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Scan to access your trip on mobile
                  </h4>
                  <div className="bg-white p-4 rounded-2xl">
                    <QRCodeCanvas value={qrPayload} size={180} />
                  </div>
                  <p className="text-sm text-gray-400">
                    QR Code contains your booking details and route plan
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Footer with animations */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500 text-sm border-t border-white/10"
        >
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> support@am38.com</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +230 000000</span>
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Mauritius</span>
          </div>
          <p>© 2024 AM38 Rent a Car • No hidden fees • Airport delivery • 24/7 support</p>
        </motion.footer>
      </div>
    </div>
  );
}