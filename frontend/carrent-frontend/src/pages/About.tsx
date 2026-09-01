import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Car,
  Award,
  MapPin,
  Clock,
  Shield,
  Plane,
  Sparkles,
  Leaf,
  HeartHandshake,
  Globe2,
  Star,
  Trophy,
  Crown,
  Zap,
  Rocket,
  Compass,
  X,
  Calendar,
  Smartphone,
  Zap as ZapIcon,
  Cloud,
  User,
  Briefcase,
} from "lucide-react";

type AboutType = {
  title: string;
  content: string;
  heroImage?: { url: string };
};

const stats = [
  { icon: Car, value: "150+", label: "Vehicles in Fleet" },
  { icon: Users, value: "10K+", label: "Happy Customers" },
  { icon: Award, value: "13+", label: "Years of Excellence" },
  { icon: Globe2, value: "25+", label: "Countries Served" },
];

// ===== TEAM MEMBERS - EXACT TEXT FROM YOUR WORD DOCUMENT =====
const teamMembers = [
  {
    id: 1,
    name: "Mrs Reshmee",
    role: "Founding Director",
    image: "/team/reshmee.png",
    description: `As the founding director of AM38, she played a key role in establishing the company. Her strong experience in the Hotel & Tourism Industry contributes to guide the team she helped build. Her legacy and values she instilled from the very beginning continue to play a key role in the day to day running of the company. We remain grateful for her guidance and the strong foundation she built for AM38.`,
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    order: 1,
  },
  {
    id: 2,
    name: "Mr Rishi",
    role: "Managing Director",
    image: "/team/rishi.png",
    description: `He is the driving force behind AM38's growth and development. Known for his professionalism, dedication, and hands-on approach, he is passionate about delivering reliable, high-quality service to every customer. He believes that trust, integrity, and attention to detail are the foundations of a successful business. Whether developing international partnerships, managing the company's fleet, or assisting with customer concerns, his vision and leadership continue to shape the success and reputation of AM38. His approachable nature and commitment to helping others make him a valued leader within the company and a trusted point of contact for customers and partners alike.`,
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    order: 2,
  },
  {
    id: 3,
    name: "Mrs Anusha",
    role: "Reservations & Operations Manager",
    image: "/team/anusha.png",
    description: `She is the person behind the smooth coordination of all bookings and reservations at AM38. She is highly organised, detail-oriented, and committed to ensuring that every customer receives a seamless and stress-free booking experience. With a solution-oriented approach, she manages enquiries, schedules, and reservation details with precision and care. Her focus on clear communication and efficiency helps ensure that each client's journey with AM38 begins on the right note. She plays a key role in keeping daily operations running smoothly and ensuring that every customer feels supported from the first contact to the final handover of the vehicle.`,
    icon: Briefcase,
    color: "from-green-500 to-emerald-500",
    order: 3,
  },
  {
    id: 4,
    name: "Aniket",
    role: "Charge of Customer Service & Car Delivery Agent",
    image: "/team/aniket.png",
    description: `As one of the first people our customers meet, Aniket plays an important role in creating a positive first impression. He warmly welcomes every guest, guides them through the vehicle collection process, and ensures each handover is smooth, efficient, and stress-free. Taking the time to explain key vehicle features and answer any questions, he helps customers feel confident before they drive away. With his friendly approach, attention to detail, and commitment to excellent service, Aniket helps make every delivery a memorable start to the customer's journey with us.`,
    icon: User,
    color: "from-yellow-500 to-orange-500",
    order: 4,
  },
  {
    id: 5,
    name: "Krish",
    role: "Car Delivery Agent",
    image: "", // No photo available
    description: `Although new to the team, Krish has quickly made a positive impression through his strong work ethic, enthusiasm, and willingness to learn. He approaches every task with dedication and executes his responsibilities efficiently, ensuring customers receive a smooth and professional experience. Whether assisting with vehicle deliveries, preparing cars for handover, or supporting the team, Krish is reliable and committed to delivering excellent service every step of the way.`,
    icon: Rocket,
    color: "from-red-500 to-pink-500",
    order: 5,
  },
];

const timelineData = [
  { 
    year: "2013", 
    title: "AM38 Founded", 
    text: "Built to make Mauritius car rental simpler, safer and more transparent.",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    story: "AM38 was founded in 2013 with a simple mission: to revolutionize car rental in Mauritius. Starting with just 5 vehicles, we focused on providing transparent pricing, reliable service, and hassle-free rentals. Our commitment to customer satisfaction quickly made us a trusted name among locals and tourists alike."
  },
  { 
    year: "2015", 
    title: "Airport Delivery", 
    text: "Expanded to fast SSR Airport pickup and hotel delivery.",
    icon: Plane,
    color: "from-green-500 to-emerald-500",
    story: "Recognizing the needs of international travelers, AM38 introduced dedicated airport delivery service at SSR International Airport. We pioneered the concept of 'meet-and-greet' service where our agent waits for you at arrivals with your vehicle ready, eliminating waiting times."
  },
  { 
    year: "2018", 
    title: "Digital Platform", 
    text: "Launched online booking and digital invoice system.",
    icon: Smartphone,
    color: "from-purple-500 to-pink-500",
    story: "AM38 embraced digital transformation by launching a fully integrated online booking platform. Customers could now browse our fleet, compare prices, and book vehicles in real-time. Our digital invoicing system made payments seamless and transparent."
  },
  { 
    year: "2020", 
    title: "Fleet Expansion", 
    text: "Added hybrid and electric vehicles to the fleet.",
    icon: Leaf,
    color: "from-emerald-500 to-teal-500",
    story: "Despite global challenges, AM38 invested in sustainable mobility by adding hybrid and electric vehicles. We positioned ourselves as eco-conscious leaders in Mauritius tourism, offering greener alternatives without compromising on luxury and comfort."
  },
  { 
    year: "2022", 
    title: "Smart Booking", 
    text: "Added digital booking, WhatsApp support and admin operations.",
    icon: ZapIcon,
    color: "from-yellow-500 to-orange-500",
    story: "AM38 revolutionized customer support with WhatsApp integration, providing 24/7 instant assistance. We launched our smart booking engine with AI-powered pricing, real-time availability, and automated confirmations, setting new standards in car rental technology."
  },
  { 
    year: "2026", 
    title: "Tourism OS", 
    text: "Building a full smart tourism and mobility platform for Mauritius.",
    icon: Cloud,
    color: "from-cyan-500 to-blue-500",
    story: "AM38 is now building the future of tourism in Mauritius. Our Tourism OS platform will integrate car rental, hotel booking, activity reservations, and real-time navigation into one seamless experience. We're creating Mauritius' first all-in-one smart tourism ecosystem."
  },
];

const promises = [
  { icon: Plane, title: "Airport Ready", text: "Pickup and drop-off support for SSR International Airport within 10 minutes." },
  { icon: Shield, title: "Safe & Insured", text: "Verified vehicles, clear policies and protection-first rental operations." },
  { icon: Clock, title: "24/7 Support", text: "Help for tourists, families and business clients anytime via WhatsApp." },
  { icon: Leaf, title: "Eco Direction", text: "More hybrid and efficient vehicles for sustainable island travel." },
  { icon: HeartHandshake, title: "Local Trust", text: "A Mauritius-based service designed around real tourist needs." },
  { icon: Globe2, title: "Global Visitors", text: "Currency, language and travel support for international customers." },
];

function MiniFeature({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 hover:bg-slate-100 transition-all duration-300">
      <Icon className="h-5 w-5 text-red-600" />
      <span className="text-sm font-semibold text-black">{text}</span>
    </div>
  );
}

// ===== TEAM MODAL =====
function TeamModal({ member, onClose }: { member: typeof teamMembers[0]; onClose: () => void }) {
  const Icon = member.icon;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${member.color} text-white shadow-lg`}>
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm font-black text-red-600">{member.role}</div>
              <h3 className="text-2xl font-black text-black">{member.name}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="mt-4 mb-6 flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-100 shadow-xl">
            {member.image ? (
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' dy='.3em' fill='%239ca3af'%3ENo Photo%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-4xl text-gray-500">
                <User className="h-12 w-12" />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-slate-700 leading-relaxed whitespace-pre-line">
          {member.description}
        </div>
        
        <div className="mt-6 flex gap-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== TIMELINE MODAL =====
function TimelineModal({ year, title, story, icon: Icon, color, onClose }: { 
  year: string; 
  title: string; 
  story: string; 
  icon: any; 
  color: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-black text-red-600">{year}</div>
              <h3 className="text-2xl font-black text-black">{title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-4 text-slate-700 leading-relaxed whitespace-pre-line">
          {story}
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function About() {
  const [data, setData] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<typeof timelineData[0] | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<typeof teamMembers[0] | null>(null);

  useEffect(() => {
    const localData = {
      title: "About Us",
      description: "Premium Mauritius car rental company offering airport delivery, tourism services and professional customer support.",
      content: `AM38 Rent a Car is Mauritius's smart mobility and tourism rental platform.

Our Commitment with years of industry experience, we understand that convenience, reliability and flexibility matters most to travellers.Our Team is dedicated to making every step of your rental journey easy - From Reservation to vehicle return.Book your car with AM38 while enjoying your coffee at the airport, and start exploring mauritius within minutes.Explore mauritius with confidence from beautiful beaches to scenic mountain roads.AM38 gives you the freedom to discover Mauritius comfortably and at your own pace.Whether you need a compact car for city travel or a spacious vehicle for familiy adventures, we have the right option for you.

Ready to book ? Booking with AM38 is quick, simple and hassle-free.Choose your vehicle, select your rental dates and confirm your reservation online with ease.Let AM38 help you enjoy a comfortable reliable and memorable travel experience in Mauritius.
Our mission is to make car rental in Mauritius simple, premium, transparent and trusted.

Why choose AM38?

You arrive in Mauritius and your plane as just landed.You have just seen the beautiful beaches in Mauritius and eager to explore the island.No time to lose!You login to our website and book a car to be delivered to you in the next few minutes.As you come out of the arrival hall,our dedicated agent is waiting for you.You are in your car driving away in the next 10 minutes.

Our force resides in our capacity to deliver your chosen car within few minutes at the airport at a very competitive price.Why Pay more for a better service, seamless car rental experience and driving a more recent car when AM38 has it all.Save big by booking with us.

You can also reserve your car with our Trusted Partner, www.Discovercars.com where you can find our offer instantly available and you can also opt for a full coverage to have complete peace of mind during your rental journey.

Our knowledgeable and dedicated staff will be glad to assist you in the event of any incident.

Discover the perfect vehicle for your next adventure from compact cars for city exploration to spacious SUV for family road trips, we offer a diverse selection of well maintained vehicles to suit every preference and budget.Whether you're seeking fuel efficiency, luxury or versatility, our fleet features the latest model from trusted brands to ensure a comfortable and enjoyable driving experience.

 ✓ Airport delivery at SSR International Airport
✓ 24/7 customer support
✓ Free cancellation rules
✓ Transparent pricing
✓ Verified vehicle fleet
✓ Smart booking and invoice flow
✓ Tourism recommendations
✓ Local Mauritius expertise

Customer satisfaction is our motto.`,
      heroImage: { url: "/about_new_image.jpeg" },
    };
    
    setData(localData as any);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      
      {/* FULLSCREEN BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/about_new_image.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
        <div className="absolute inset-0 bg-black/48" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/60 via-black/20 to-red-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen pt-8 overflow-hidden">
        <div className="relative z-20 max-w-[1600px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-4 flex-wrap">
              <img 
                src="/am38-logo.png" 
                alt="AM38 Logo" 
                className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-[-0.04em] text-[#f8fbff] drop-shadow-[0_6px_28px_rgba(0,0,0,0.85)]">
                About <br />
                <span className="bg-gradient-to-r from-cyan-100 via-white to-red-200 bg-clip-text text-transparent drop-shadow-[0_6px_28px_rgba(0,0,0,0.6)]">
                  AM38 Mauritius
                </span>
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/90 backdrop-blur-md px-5 py-2 text-sm font-black text-white border border-red-200/80 mb-6 shadow-[0_12px_40px_rgba(239,68,68,0.45)]">
              <Sparkles className="w-4 h-4" /> Your Virtual Car Rental Counter in Mauritius
            </div>

            <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed mt-6 bg-black/38 backdrop-blur-md p-5 rounded-2xl border border-white/25 shadow-xl font-semibold">
              Trusted by locals and visitors for reliable, affordable and hassle-free car rental services in Mauritius.
              AM38 makes travelling simple from the moment you arrive.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <a
                href="/cars"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-black shadow-[0_10px_40px_rgba(37,99,235,0.45)] flex items-center gap-2 hover:scale-105 transition"
              >
                <Car className="w-5 h-5" /> Book Your Car Now
              </a>

              <a
                href="/explore"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl font-black shadow-[0_10px_40px_rgba(37,99,235,0.45)] flex items-center gap-2 hover:scale-105 transition"
              >
                <Compass className="w-5 h-5" /> Explore Mauritius
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-5">
              <div className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black shadow-xl border border-white/30">
                🌍 Anywhere Around The Island
              </div>
              <div className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-red-500 text-white font-black shadow-xl">
                ⚡ Online Booking Available 24/7
              </div>
              <div className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-black shadow-xl border border-white/30">
                ✈ SSR Airport Delivery
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl flex items-center justify-center text-2xl"
              >
                📍
              </motion.div>
              <p className="text-3xl md:text-5xl font-black bg-gradient-to-r from-cyan-100 via-white to-red-200 bg-clip-text text-transparent drop-shadow-[0_6px_20px_rgba(0,0,0,0.75)]">
                Land. Book. Go.
              </p>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-2xl flex items-center justify-center text-2xl"
              >
                🚗
              </motion.div>
            </div>

            <div className="mt-10 flex justify-center">
              <div className="px-6 py-3 rounded-full bg-white/72 backdrop-blur-xl border border-white/70 shadow-xl">
                <p className="text-slate-900 font-black">🔥 Serving Travelers Since 2013</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 flex justify-center pb-12 relative">
          <h2 className="relative text-center text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.12em] bg-gradient-to-r from-cyan-100 via-white to-red-200 bg-clip-text text-transparent drop-shadow-[0_6px_28px_rgba(0,0,0,0.75)]">
            AM38 AT YOUR SERVICE SINCE 2013
          </h2>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08 }}
                className="bg-white rounded-3xl p-6 text-center shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="h-8 w-8 mx-auto text-red-600 mb-3" />
                <div className="text-3xl font-black text-black">{stat.value}</div>
                <div className="text-sm text-gray-500 font-semibold">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-[1fr_420px] gap-8">
        <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100">
          <div className="text-sm font-black uppercase tracking-[0.25em] text-red-600">Our Story</div>
          <div className="mt-5 text-base text-gray-700 whitespace-pre-line leading-relaxed">
            {data?.content}
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
            <MiniFeature icon={Clock} text="24/7 Roadside Assistance" />
            <MiniFeature icon={Shield} text="Comprehensive Insurance" />
            <MiniFeature icon={MapPin} text="Free Airport Delivery" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[40px] bg-gradient-to-r from-[#11265f] to-[#8b2638] text-white p-8 shadow-xl">
            <Crown className="h-10 w-10 text-yellow-400 mb-4" />
            <div className="text-3xl font-black">Trusted Local Operator</div>
            <p className="mt-3 text-white/80">
              Built for Mauritius, international tourists, hotels, airport arrivals and premium mobility operations.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-2 font-bold">4.9/5 from 10K+ reviews</span>
            </div>
          </div>

          <div className="rounded-[40px] bg-white border border-gray-100 p-8 shadow-xl">
            <div className="text-2xl font-black text-black mb-5 flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-red-600" />
              Customer Promise
            </div>
            <div className="space-y-4">
              {promises.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-black text-black">{item.title}</div>
                      <div className="text-sm text-gray-500">{item.text}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MEET OUR TEAM - EXACT ORDER FROM YOUR WORD DOCUMENT ===== */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-[40px] border border-gray-100 bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-7 w-7 text-red-600" />
            <div>
              <div className="text-3xl font-black text-black">Meet Our Team</div>
              <div className="text-gray-500">The people behind AM38's exceptional service</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {teamMembers
              .sort((a, b) => a.order - b.order)
              .map((member, idx) => {
                const Icon = member.icon;
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    onClick={() => setSelectedTeamMember(member)}
                    className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden text-center"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      {/* Photo */}
                      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-red-100 shadow-lg mb-3 group-hover:border-red-300 group-hover:shadow-red-100 transition-all duration-300">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' dy='.3em' fill='%239ca3af'%3ENo Photo%3C/text%3E%3C/svg%3E";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-4xl text-gray-500">
                            <User className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                      
                      <div className={`inline-flex p-2 rounded-xl bg-gradient-to-r ${member.color} text-white shadow-lg mb-2`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="font-black text-black text-sm">{member.name}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{member.role}</div>
                      
                      <div className="mt-3 text-xs font-bold text-red-600 group-hover:text-red-700 transition flex items-center justify-center gap-1">
                        Click to learn more <Users className="h-3 w-3" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
          
          {/* Team Description Footer - EXACT TEXT FROM WORD DOCUMENT */}
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100">
            <p className="text-sm text-gray-700 text-center font-medium">
              Together, we are proud to help visitors explore the beauty of Mauritius with confidence, comfort, and peace of mind.
            </p>
            <p className="text-xs text-red-600 text-center mt-1 font-bold">
              AM38 — Reliable Cars. Friendly Service.
            </p>
          </div>
        </div>
      </div>

      {/* Company Timeline */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-[40px] border border-gray-100 bg-white p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-7 w-7 text-red-600" />
            <div>
              <div className="text-3xl font-black text-black">Our Journey</div>
              <div className="text-gray-500">From 2013 to today</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {timelineData.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedYear(item)}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`inline-flex p-2 rounded-xl bg-gradient-to-r ${item.color} text-white shadow-lg mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">{item.year}</div>
                    <div className="mt-1 font-black text-black text-sm">{item.title}</div>
                    <div className="mt-1 text-xs text-gray-500 line-clamp-2">{item.text}</div>
                    <div className="mt-3 text-xs font-bold text-red-600 group-hover:text-red-700 transition flex items-center gap-1">
                      Click to read more <Calendar className="h-3 w-3" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Stats Banner */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="rounded-[40px] bg-gradient-to-r from-red-600 to-orange-500 p-8 text-center text-white shadow-2xl">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl font-black mb-3">Serving Travelers Since 2013</h2>
          <p className="text-white/90 mb-6">Join thousands of happy customers who trust AM38 for their Mauritius adventure</p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-black">150+</div>
              <div className="text-sm text-white/80">Premium Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">10K+</div>
              <div className="text-sm text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">10 min</div>
              <div className="text-sm text-white/80">Avg Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Modal */}
      <AnimatePresence>
        {selectedTeamMember && (
          <TeamModal
            member={selectedTeamMember}
            onClose={() => setSelectedTeamMember(null)}
          />
        )}
      </AnimatePresence>

      {/* Timeline Modal */}
      <AnimatePresence>
        {selectedYear && (
          <TimelineModal
            year={selectedYear.year}
            title={selectedYear.title}
            story={selectedYear.story}
            icon={selectedYear.icon}
            color={selectedYear.color}
            onClose={() => setSelectedYear(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}