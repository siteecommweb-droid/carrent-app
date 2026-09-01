import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Star,
  Shield,
  TrendingUp,
  Sparkles,
  X,
  Search,
  ExternalLink,
  Award,
  Users,
  Crown,
  Linkedin,
  Mail,
  Building2,
  Phone,
} from "lucide-react";

import toast from "react-hot-toast";

interface Partner {
  id: number;
  name: string;
  url: string;
  logo: string;
  description: string;
  discount: string;
  rating: number;
  category: string;
  recommended?: boolean;
}

const partnersList: Partner[] = [
  {
    id: 1,
    name: "DiscoverCars",
    url: "https://discovercars.com",
    logo: "/partners/discovercars.png",
    description: "Global car rental marketplace with 900+ suppliers worldwide.",
    discount: "Up to 15% off",
    rating: 4.8,
    category: "Marketplace",
    recommended: true,
  },
  {
    id: 2,
    name: "CarJet",
    url: "https://carjet.com",
    logo: "/partners/carjet.png",
    description: "Compare prices from 900+ car rental companies instantly.",
    discount: "Best price guarantee",
    rating: 4.7,
    category: "Comparison",
  },
  {
    id: 3,
    name: "Rentiles",
    url: "https://rentiles.com",
    logo: "/partners/rentiles.png",
    description: "Local fleet specialists with exclusive AM38 rates.",
    discount: "Exclusive AM38 rates",
    rating: 4.9,
    category: "Local",
  },
  {
    id: 4,
    name: "EconomyBookings",
    url: "https://economybookings.com",
    logo: "/partners/economybooking.png",
    description: "Leading car rental comparison platform worldwide.",
    discount: "Best price guaranteed",
    rating: 4.6,
    category: "Comparison",
  },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function Partners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    brn: "",
    country: "",
    website_url: "",
    contact_person: "",
    business_email: "",
    phone_number: "",
    partnership_type: "",
    message: "",
  });

  const filtered = partnersList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitPartnerRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/partners/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Partner request submitted successfully");
        setForm({
          company_name: "",
          brn: "",
          country: "",
          website_url: "",
          contact_person: "",
          business_email: "",
          phone_number: "",
          partnership_type: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949]">
      
      {/* HERO with Two People Shaking Hands - FIXED: Brighter and more visible */}
      <div className="relative overflow-hidden py-32">
        <div 
          className="absolute inset-0 bg-cover bg-[center_20%] bg-no-repeat"
          style={{
            backgroundImage: "url('/aboutus_image.png')",
            backgroundPosition: "center 25%",
            backgroundSize: "cover",
          }}
        />
        {/* LIGHTER OVERLAY - More transparent to show image better */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12306b]/50 via-[#20366f]/40 to-[#8b2638]/50" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* BRIGHTNESS BOOST - Extra overlay to brighten */}
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl rounded-full px-6 py-3 border border-white/30 mb-7"
          >
            <Award size={18} className="text-yellow-400" />
            <span className="text-white font-bold tracking-wide drop-shadow-lg">Worldwide Partnership Network</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
            AM38 Partners
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-white max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            Join AM38 Rent A Car and connect your OTA, travel agency,
            booking engine or platform with our premium Mauritius fleet.
          </p>
          
          <div className="max-w-xl mx-auto mt-12">
            <div className="relative">
              <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/90" />
              <input
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 pl-14 pr-6 text-white placeholder:text-white/90 outline-none focus:border-white/60 focus:bg-white/25 transition-all shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PARTNERS GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((partner, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              key={partner.id}
              onClick={() => setSelectedPartner(partner)}
              className="bg-white rounded-[30px] p-6 shadow-2xl cursor-pointer hover:shadow-3xl transition-all relative"
            >
              {/* RECOMMENDED BADGE - Only on DiscoverCars */}
              {partner.recommended && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 border-2 border-white">
                    <Star size={12} className="fill-black" />
                    RECOMMENDED
                  </div>
                </div>
              )}
              
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-16 object-contain mx-auto" 
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/200x80/1e293b/ffffff?text=" + partner.name; }} 
              />
              <h3 className="mt-5 text-xl font-black text-center text-black">{partner.name}</h3>
              <p className="mt-3 text-center text-slate-600 text-sm">{partner.description}</p>
              <div className="mt-4 flex justify-center gap-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-black">{partner.rating}</span>
                <span className="text-slate-400 text-sm">• {partner.category}</span>
              </div>
              <div className="mt-4 text-center">
                <span className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold">{partner.discount}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY PARTNER WITH US */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-black drop-shadow-sm">Why Partner With AM38?</h2>
          <p className="mt-4 text-slate-800 max-w-2xl mx-auto text-lg font-medium">
            Join the fastest-growing car rental network in Mauritius
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[30px] p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-black text-black">Increased Revenue</h3>
            <p className="mt-3 text-slate-600">Access our growing customer base and increase your bookings</p>
          </div>
          <div className="bg-white rounded-[30px] p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-black text-black">Secure Integration</h3>
            <p className="mt-3 text-slate-600">Our API is secure, reliable, and easy to integrate</p>
          </div>
          <div className="bg-white rounded-[30px] p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-black text-black">Global Reach</h3>
            <p className="mt-3 text-slate-600">Connect with travelers from around the world</p>
          </div>
        </div>
      </section>

      {/* BECOME A PARTNER FORM */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-[40px] p-10 shadow-2xl">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-black text-black">
              Become An International Partner
            </h2>
            <p className="mt-4 text-slate-700 max-w-2xl mx-auto font-semibold">
              Hotels, OTA platforms, agencies, booking systems and travel providers can connect directly with AM38.
            </p>
          </div>

          <form onSubmit={submitPartnerRequest} className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              placeholder="Company Name *"
              required
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <input
              type="text"
              name="brn"
              value={form.brn}
              onChange={handleChange}
              placeholder="Business Registration Number"
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <input
              type="text"
              name="website_url"
              value={form.website_url}
              onChange={handleChange}
              placeholder="Website URL"
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <input
              type="text"
              name="contact_person"
              value={form.contact_person}
              onChange={handleChange}
              placeholder="Contact Person"
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <input
              type="email"
              name="business_email"
              value={form.business_email}
              onChange={handleChange}
              placeholder="Business Email *"
              required
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <select
              name="partnership_type"
              value={form.partnership_type}
              onChange={handleChange}
              className="h-14 rounded-2xl border-2 border-slate-300 bg-white px-5 text-black font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            >
              <option value="">Partnership Type</option>
              <option value="API Integration">API Integration</option>
              <option value="Travel Agency">Travel Agency</option>
              <option value="OTA Platform">OTA Platform</option>
              <option value="Affiliate">Affiliate</option>
              <option value="Hotel Partner">Hotel Partner</option>
            </select>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us about your business and requirements..."
              className="md:col-span-2 rounded-2xl border-2 border-slate-300 bg-white p-5 min-h-[150px] text-black font-black placeholder:text-black placeholder:font-black outline-none focus:border-red-600 focus:ring-4 focus:ring-red-200"
            />

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-xl font-black text-white hover:from-red-700 hover:to-red-800 transition-all shadow-2xl"
            >
              {loading ? "Submitting..." : "Submit Partnership Request"}
            </button>

          </form>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-[40px] bg-gradient-to-r from-[#11265f] via-[#20366f] to-[#8b2638] p-10 text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black">Contact AM38</h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <Phone className="text-red-400" size={28} />
              <div>
                <div className="text-sm text-white/90">Phone</div>
                <div className="font-black text-xl">+230 5835 7166</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-red-400" size={28} />
              <div>
                <div className="text-sm text-white/90">Email</div>
                <div className="font-black text-xl">contact@am38rentacar.com</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Building2 className="text-red-400" size={28} />
              <div>
                <div className="text-sm text-white/90">Support</div>
                <div className="font-black text-xl">24/7 Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER MODAL */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPartner(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-black transition"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-4">
                <img
                  src={selectedPartner.logo}
                  alt={selectedPartner.name}
                  className="h-16 mx-auto mb-4 object-contain"
                  onError={(e) => (e.currentTarget as HTMLImageElement).src = "https://placehold.co/200x80/1e293b/ffffff?text=" + selectedPartner.name}
                />
                <h3 className="text-2xl font-black text-black">{selectedPartner.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-black">{selectedPartner.rating}</span>
                  </div>
                  <span className="text-slate-400">• {selectedPartner.category}</span>
                </div>
              </div>
              
              <p className="text-slate-600 text-center mb-4">{selectedPartner.description}</p>
              
              <div className="bg-red-50 rounded-xl p-3 text-center mb-4">
                <span className="font-bold text-red-600">{selectedPartner.discount}</span>
                <span className="text-slate-500 text-sm ml-2">• Exclusive for AM38 customers</span>
              </div>
              
              <a
                href={selectedPartner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Visit Partner <ExternalLink size={16} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}