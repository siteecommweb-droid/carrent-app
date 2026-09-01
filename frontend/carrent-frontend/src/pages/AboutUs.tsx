import { useEffect, useMemo, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  Plane,
  CarFront,
  ShieldCheck,
  TimerReset,
  Star,
  BadgeCheck,
  MapPin,
  User,
  Award,
  Heart,
  Clock,
  CheckCircle,
  Globe2,
  Users,
  Sparkles,
  Trophy,
  Diamond,
  Zap,
  Rocket,
  Compass,
  Coffee,
  Sun,
  Cloud,
  Wind,
  Thermometer,
  Camera,
  Music,
  Wifi,
  Battery,
  Navigation,
  Gift,
  Crown,
  Headphones
} from "lucide-react";

type AboutPageData = {
  title?: string;
  subtitle?: string;
  heroImage?: string;
  content?: string;
  background?: string;
  instantBooking?: string;
  fleet?: string;
};

type AboutSection = {
  heading: string;
  paragraphs: string[];
};

const fallbackTitle = "About Us";
const fallbackSubtitle = "Learn more about AM38 — Mauritius' trusted car rental partner since 2013";

const fallbackSections: AboutSection[] = [
  {
    heading: "The Future of Mobility",
    paragraphs: [
      "AM38 isn't just a car rental company — it's a movement. We've reimagined the entire experience from landing to driving, eliminating wait times and introducing AI-powered vehicle delivery that meets you exactly when you need it.",
      "Our headquarters in Plaine Magnien is strategically located just 2–3 minutes from Sir Seewoosagur Ramgoolam International Airport, featuring a fleet of connected vehicles ready for instant deployment.",
      "Experience the VIP treatment with our signature meet-and-greet service. Your personal concierge will be waiting at arrivals with a tablet, ready to scan your digital boarding pass and guide you to your pre-warmed, cleaned, and fueled vehicle."
    ],
  },
  {
    heading: "Our Tech-Powered Promise",
    paragraphs: [
      "Skip the queues, skip the paperwork, skip the waiting. Our blockchain-verified digital contracts mean you sign once and drive instantly. Every rental is tracked in real-time, with transparent pricing that never includes hidden fees.",
      "We guarantee vehicle delivery in under 10 minutes — or your first day is free. That's the AM38 guarantee, backed by our real-time GPS tracking and fleet optimization algorithms.",
      "From economy electric vehicles to luxury SUVs, each car in our fleet is equipped with Apple CarPlay, Android Auto, dash cams, and emergency roadside assistance."
    ],
  },
  {
    heading: "Next-Generation Fleet",
    paragraphs: [
      "Every vehicle undergoes a 50-point inspection before each rental, including deep cleaning, sanitization, and performance testing. Our predictive maintenance system alerts our team before any issue arises.",
      "Choose from our curated collection: Tesla Model 3 Performance, BMW iX, Mercedes EQS, Toyota Land Cruiser, and a growing fleet of hybrid and electric vehicles supporting sustainable tourism.",
      "Need something special? Our premium request system allows you to reserve specific models, add child seats, roof racks, or even arrange for a chauffeur."
    ],
  },
];

function parseContentToSections(content?: string): AboutSection[] {
  if (!content || !content.trim()) return fallbackSections;

  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: AboutSection[] = [];
  let current: AboutSection | null = null;

  for (const line of lines) {
    const looksLikeHeading =
      line.length < 80 &&
      !line.endsWith(".") &&
      !line.includes("•") &&
      line === line.trim();

    if (looksLikeHeading) {
      if (current) sections.push(current);
      current = { heading: line, paragraphs: [] };
    } else {
      if (!current) {
        current = { heading: "About AM38", paragraphs: [] };
      }
      current.paragraphs.push(line);
    }
  }

  if (current) sections.push(current);

  return sections.length ? sections : fallbackSections;
}

function FeatureCard({
  icon,
  title,
  text,
  delay,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  delay?: number;
  gradient?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, delay: delay || 0, type: "spring" }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotateY: isHovered ? 5 : 0, rotateX: isHovered ? -5 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
      />
      <div className={`relative rounded-3xl border border-white/10 bg-gradient-to-br ${gradient || "from-white/10 to-white/5"} backdrop-blur-xl p-6 shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <motion.div 
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
          animate={{ rotate: isHovered ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-black bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-white/70">{text}</p>
        <motion.div 
          className="mt-4 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-500"
          animate={{ width: isHovered ? "100%" : "0%" }}
        />
      </div>
    </motion.div>
  );
}

function StatCard({ value, label, icon, delay }: { value: string; label: string; icon: React.ReactNode; delay?: number }) {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value) || 0;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (targetValue > 0) {
        let current = 0;
        const interval = setInterval(() => {
          current += Math.ceil(targetValue / 50);
          if (current >= targetValue) {
            setCount(targetValue);
            clearInterval(interval);
          } else {
            setCount(current);
          }
        }, 20);
        return () => clearInterval(interval);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [targetValue]);
  
  const displayValue = targetValue > 0 ? count : value;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay || 0, type: "spring" }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      <div className="relative text-center p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
        <div className="flex justify-center mb-3">
          <div className="rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-3">
            {icon}
          </div>
        </div>
        <motion.div 
          className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {displayValue}
        </motion.div>
        <div className="text-xs uppercase tracking-wider text-white/60 mt-2">{label}</div>
      </div>
    </motion.div>
  );
}

function FloatingParticle() {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-cyan-400 rounded-full"
      animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 200 - 100, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 5,
      }}
    />
  );
}

export default function AboutUs() {
  const [cmsData, setCmsData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  
  const heroScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0.5]);
  const parallaxY = useTransform(smoothProgress, [0, 1], [0, 200]);

  useEffect(() => {
    let mounted = true;

    const localData = {
      title: "About Us",
      subtitle: "Learn more about AM38 — Mauritius' trusted car rental partner since 2013",
      content: JSON.stringify([
        {
          heading: "The Future of Mobility",
          paragraphs: [
            "AM38 isn't just a car rental company — it's a movement. We've reimagined the entire experience from landing to driving, eliminating wait times and introducing AI-powered vehicle delivery that meets you exactly when you need it.",
            "Our headquarters in Plaine Magnien is strategically located just 2–3 minutes from Sir Seewoosagur Ramgoolam International Airport, featuring a fleet of connected vehicles ready for instant deployment.",
            "Experience the VIP treatment with our signature meet-and-greet service. Your personal concierge will be waiting at arrivals with a tablet, ready to scan your digital boarding pass and guide you to your pre-warmed, cleaned, and fueled vehicle."
          ]
        },
        {
          heading: "Our Tech-Powered Promise",
          paragraphs: [
            "Skip the queues, skip the paperwork, skip the waiting. Our blockchain-verified digital contracts mean you sign once and drive instantly. Every rental is tracked in real-time, with transparent pricing that never includes hidden fees.",
            "We guarantee vehicle delivery in under 10 minutes — or your first day is free. That's the AM38 guarantee, backed by our real-time GPS tracking and fleet optimization algorithms.",
            "From economy electric vehicles to luxury SUVs, each car in our fleet is equipped with Apple CarPlay, Android Auto, dash cams, and emergency roadside assistance."
          ]
        },
        {
          heading: "Next-Generation Fleet",
          paragraphs: [
            "Every vehicle undergoes a 50-point inspection before each rental, including deep cleaning, sanitization, and performance testing. Our predictive maintenance system alerts our team before any issue arises.",
            "Choose from our curated collection: Tesla Model 3 Performance, BMW iX, Mercedes EQS, Toyota Land Cruiser, and a growing fleet of hybrid and electric vehicles supporting sustainable tourism.",
            "Need something special? Our premium request system allows you to reserve specific models, add child seats, roof racks, or even arrange for a chauffeur."
          ]
        }
      ]),
      heroImage: "/about_new_image.jpeg",
      background: "/home-bg.jpg",
      instantBooking: "Under 10 minutes delivery",
      fleet: "150+ Premium Vehicles"
    };
    
    if (mounted) {
      setCmsData({
        title: localData.title,
        subtitle: localData.subtitle,
        heroImage: localData.heroImage,
        content: localData.content,
        background: localData.background,
        instantBooking: localData.instantBooking,
        fleet: localData.fleet,
      });
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const heroTitle = cmsData?.title || fallbackTitle;
  const heroSubtitle = cmsData?.subtitle || fallbackSubtitle;
  const heroImageUrl = cmsData?.heroImage || "/about_new_image.jpeg";

  const contentSections = useMemo(() => {
    if (!cmsData?.content) return fallbackSections;
    return parseContentToSections(cmsData.content);
  }, [cmsData]);

  useEffect(() => {
    if (contentSections.length > 0) {
      const interval = setInterval(() => {
        setActiveSection((prev) => (prev + 1) % contentSections.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [contentSections.length]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
        <motion.div 
          className="text-center"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 font-bold">Loading Experience...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 overflow-x-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <FloatingParticle key={i} />
        ))}
      </div>

      {/* Hero Section with 3D Parallax */}
      <motion.div 
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: parallaxY }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 via-purple-600/30 to-pink-600/30 mix-blend-overlay" />
          <img
            src={heroImageUrl}
            alt="About AM38"
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = "/about_new_image.jpeg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-10 text-center max-w-5xl mx-auto px-4"
        >
          <motion.div 
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-2xl px-5 py-2 text-sm font-bold text-cyan-400 border border-white/20 mb-6"
            animate={{ 
              boxShadow: [
                "0 0 0px rgba(0,255,255,0)",
                "0 0 20px rgba(0,255,255,0.5)",
                "0 0 0px rgba(0,255,255,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Rocket className="h-4 w-4" />
            AI-Powered Luxury Rental
            <Sparkles className="h-3 w-3" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            About Us
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <motion.a 
              href="/cars" 
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CarFront className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Explore Fleet
            </motion.a>
            <motion.a 
              href="/support" 
              className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Headphones className="h-5 w-5" />
              24/7 Concierge
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-cyan-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Section with animated counters */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="2-3" label="Minutes from Airport" icon={<Plane className="h-6 w-6 text-cyan-400" />} delay={0} />
          <StatCard value="10" label="Max Delivery Time" icon={<Clock className="h-6 w-6 text-cyan-400" />} delay={0.1} />
          <StatCard value="150+" label="Fleet Vehicles" icon={<CarFront className="h-6 w-6 text-cyan-400" />} delay={0.2} />
          <StatCard value="4.9" label="Customer Rating" icon={<Star className="h-6 w-6 text-yellow-400" />} delay={0.3} />
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-10 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Why Choose AM38
          </h2>
          <p className="text-white/60 mt-4">Experience the future of car rental</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Plane className="h-7 w-7" />}
            title="Instant Airport Pickup"
            text="VIP meet-and-greet at arrivals with tablet-based check-in and instant vehicle delivery."
            delay={0}
            gradient="from-cyan-500/20 to-blue-500/20"
          />
          <FeatureCard
            icon={<Zap className="h-7 w-7" />}
            title="AI-Powered Delivery"
            text="Real-time tracking and predictive deployment ensures your car arrives when you do."
            delay={0.1}
            gradient="from-purple-500/20 to-pink-500/20"
          />
          <FeatureCard
            icon={<ShieldCheck className="h-7 w-7" />}
            title="Blockchain Verified"
            text="Smart contracts, transparent pricing, and tamper-proof rental agreements."
            delay={0.2}
            gradient="from-green-500/20 to-emerald-500/20"
          />
          <FeatureCard
            icon={<Diamond className="h-7 w-7" />}
            title="Premium Fleet"
            text="Tesla, BMW, Mercedes, and more — all equipped with the latest tech."
            delay={0.3}
            gradient="from-yellow-500/20 to-orange-500/20"
          />
        </div>
      </section>

      {/* Main Content with 3D Sections */}
      <div className="mx-auto max-w-7xl px-4 pb-20 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
          {/* Content Sections with auto-rotation indicator */}
          <div className="space-y-8">
            <div className="flex gap-2 justify-center mb-4">
              {contentSections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSection(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    activeSection === idx ? "w-8 bg-cyan-400" : "w-4 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl"
              >
                <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-cyan-400" />
                  {contentSections[activeSection]?.heading}
                </h2>
                <div className="mt-6 space-y-4">
                  {contentSections[activeSection]?.paragraphs.map((paragraph, pIndex) => (
                    <motion.p
                      key={`${activeSection}-p-${pIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pIndex * 0.1 }}
                      className="text-white/70 leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Enhanced */}
          <div className="space-y-6">
            {/* Why AM38 Premium Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)] opacity-10" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-2 text-xs font-bold">
                  <Crown className="h-3 w-3" />
                  Premium Service
                </div>
                <h2 className="mt-6 text-3xl font-black">Instant Booking = Instant Delivery</h2>
                <p className="mt-4 text-white/90 leading-relaxed">
                  Skip the queues. Your vehicle will be waiting as you clear customs.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    "Delivery in under 10 minutes or it's free",
                    "No hidden fees — AI-verified pricing",
                    "VIP concierge meet-and-greet",
                    "24/7 WhatsApp priority support",
                    "Free GPS and dash cam included"
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur px-4 py-3 hover:bg-white/20 transition-all"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <span className="font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tech Stack Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                Our Tech Stack
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Navigation className="h-4 w-4 text-cyan-400" />
                  Real-time GPS
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Wifi className="h-4 w-4 text-cyan-400" />
                  In-car WiFi
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Music className="h-4 w-4 text-cyan-400" />
                  Apple CarPlay
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Battery className="h-4 w-4 text-cyan-400" />
                  EV Charging
                </div>
              </div>
            </motion.div>

            {/* Fleet Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <CarFront className="h-5 w-5 text-cyan-400" />
                Fleet Categories
              </h3>
              <div className="mt-4 space-y-2">
                {["Economy Elite", "Luxury Sedan", "Premium SUV", "Family 7-Seater", "Electric Performance"].map((cat) => (
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/70">{cat}</span>
                    <BadgeCheck className="h-4 w-4 text-cyan-400" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Trust Score Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 backdrop-blur-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-black text-white">TrustScore 4.9</div>
                  <div className="text-xs text-white/60">Based on 2,500+ verified reviews</div>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "98%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Meet Us Fancily - Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-8 w-8 text-cyan-400" />
            <div>
              <div className="text-3xl font-black text-white">Meet Us Fancily</div>
              <div className="text-white/60">Our journey from 2013 to today</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { year: "2013", title: "AM38 Founded", text: "Built to make Mauritius car rental simpler, safer and more transparent." },
              { year: "2015", title: "Airport Delivery", text: "Expanded to fast SSR Airport pickup and hotel delivery." },
              { year: "2018", title: "Digital Platform", text: "Launched online booking and digital invoice system." },
              { year: "2020", title: "Fleet Expansion", text: "Added hybrid and electric vehicles to the fleet." },
              { year: "2022", title: "Smart Booking", text: "Added digital booking, WhatsApp support and admin operations." },
              { year: "2026", title: "Tourism OS", text: "Building a full smart tourism and mobility platform for Mauritius." },
            ].map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-2xl font-black text-cyan-400">{item.year}</div>
                <div className="mt-2 font-black text-white text-sm">{item.title}</div>
                <div className="mt-1 text-xs text-white/50">{item.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotateX: -15 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          viewport={{ once: true }}
          className="relative mt-16 rounded-3xl bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 p-10 text-center shadow-2xl overflow-hidden group"
          style={{ perspective: "1000px" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_60%)]" />
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-3">
              Ready to Drive the Future?
            </h3>
            <p className="text-white/90 mb-6">Book your premium vehicle in under 60 seconds</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a 
                href="/cars" 
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CarFront className="h-5 w-5" />
                Browse Fleet
              </motion.a>
              <motion.a 
                href="/support" 
                className="px-8 py-4 bg-white/20 backdrop-blur border border-white/30 text-white rounded-2xl font-bold hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Headphones className="h-5 w-5" />
                Contact Concierge
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}