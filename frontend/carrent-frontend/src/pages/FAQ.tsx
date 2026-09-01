import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Phone, MessageCircle, HelpCircle, Car, FileText, Shield, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

type FAQItem = {
  q: string;
  a: string;
  category: string;
};

const faqData: FAQItem[] = [
  // Existing questions
  { q: "Airport delivery?", a: "Yes, direct delivery at SSR International Airport. Our team will meet you at the arrival hall with your vehicle. Free delivery for all bookings.", category: "Booking" },
  { q: "Deposit required?", a: "A refundable deposit of Rs 5,000 - Rs 15,000 is required depending on the vehicle category. This is returned after vehicle inspection (usually within 7-14 business days).", category: "Payment" },
  { q: "Free cancellation?", a: "Free cancellation up to 24 hours before pickup. Within 24 hours: 50% charge. No-show: 100% charge. Contact us immediately for any changes.", category: "Policy" },
  { q: "Insurance included?", a: "Basic insurance is included. Excess reduction available for Rs 300/day. Customer responsible for first Rs 10,000 of damage. Full coverage options available.", category: "Insurance" },
  { q: "Driver age requirement?", a: "Minimum age is 21 years. Valid driver's license held for minimum 1 year required. International drivers need valid license or international permit.", category: "Driver" },
  { q: "Fuel policy?", a: "Full-to-full policy. Car provided with full tank, must be returned full. Fuel charges apply if not returned full. We track fuel levels before and after.", category: "Vehicle" },
  { q: "Late return fee?", a: "1-hour grace period. After that: Rs 500/hour late fee. Over 4 hours: charged full additional day. Always notify us if you'll be late.", category: "Policy" },
  { q: "Multiple drivers allowed?", a: "Yes, additional drivers are allowed with a fee of Rs 200/day. They must meet age and license requirements. All drivers must be present at pickup.", category: "Driver" },
  { q: "Payment methods?", a: "We accept credit/debit cards (Visa, Mastercard, Amex), online payments via Stripe, bank transfer, MCB Juice, and cash on delivery.", category: "Payment" },
  { q: "24/7 support?", a: "Yes, our WhatsApp support is available 24/7 at +230 5835 7166 for emergencies and assistance. Call us anytime for roadside help.", category: "Support" },
  { q: "What documents do I need?", a: "Valid driver's license, passport or national ID, and a valid credit card for deposit. International visitors need passport copy and return flight ticket.", category: "Documents" },
  { q: "Can I extend my rental?", a: "Yes, contact us at least 24 hours before return. Extension subject to vehicle availability. Late extension fees may apply.", category: "Booking" },
  
  // NEW MAURITIUS-SPECIFIC QUESTIONS
  { q: "Do I need an International Driving Permit in Mauritius?", a: "If your license is in English (UK, USA, Australia, India), no IDP is needed. For non-English licenses, an IDP is recommended. Always carry your original license during driving.", category: "Driver" },
  { q: "What are the speed limits in Mauritius?", a: "Highway: 110 km/h, Main roads: 80 km/h, Built-up areas: 40-60 km/h, School zones: 30 km/h. Fines start from Rs 2,000. Police conduct regular checks.", category: "Law" },
  { q: "Is it safe to drive at night in Mauritius?", a: "Yes, but caution is advised. Main roads are well-lit. Be careful of pedestrians, animals on rural roads. Reduce speed after 8 PM. Our cars have full LED headlights.", category: "Safety" },
  { q: "What should I do in case of accident?", a: "1. Stop immediately, 2. Call police (999), 3. Take photos, 4. Exchange details with others, 5. Call AM38 emergency line +230 5835 7166. Do not move vehicle until police arrive.", category: "Emergency" },
  { q: "Are there any restricted driving areas in Mauritius?", a: "No specific restrictions, but avoid driving into hiking trails or off-road areas not designated for vehicles. Some mountain roads require 4x4 vehicles.", category: "Vehicle" },
  { q: "How do I pay for parking in Mauritius?", a: "Parking is free in most areas. In Port Louis: paid parking via mobile app 'Parking Services' or pay by phone. Rates: Rs 10-30 per hour. Read street signs carefully.", category: "Parking" },
  { q: "Where can I find fuel stations near the airport?", a: "TotalEnergies and Shell stations are within 3km of SSR Airport. Both open 24/7. Return your car with full tank to avoid refueling fees.", category: "Vehicle" },
  { q: "What is the legal blood alcohol limit in Mauritius?", a: "Zero tolerance! Alcohol limit is 0.0 mg/100ml. Do not drink and drive. Severe penalties including license suspension and fines up to Rs 100,000.", category: "Law" },
  { q: "Can I take the rental car to Rodrigues island?", a: "No, vehicles are strictly for mainland Mauritius only. Car ferries are not available. You can fly to Rodrigues and rent locally there.", category: "Policy" },
  { q: "What tourist attractions are wheelchair accessible?", a: "Most major attractions: Casela, SSR Gardens, Caudan Waterfront, Bagatelle Mall. Contact us for wheelchair-accessible vehicles (free of charge).", category: "Accessibility" },
  { q: "Where are the best beaches near the airport?", a: "Blue Bay Beach (15 min), Pointe d'Esny (12 min), Mahebourg waterfront (10 min). All have clear waters and safe swimming areas.", category: "Tourism" },
  { q: "Are there toll roads in Mauritius?", a: "No, all roads in Mauritius are toll-free. Enjoy driving without extra charges. Only paid parking in Port Louis city center.", category: "Driving" },
  { q: "What should I do if I get a parking ticket?", a: "Pay within 30 days at any post office or online. Inform us immediately. Late payment fines double. We can assist with payment if needed.", category: "Policy" },
  { q: "Can I return the car outside office hours?", a: "Yes, after-hours drop-off available at our Plaine Magnien office. Keys go into secure dropbox. Extra fee applies for after-hours service.", category: "Booking" },
  { q: "What are the child safety seat laws?", a: "Children under 10 years must use appropriate child seat. We offer baby seats (0-12 months) and booster seats (1-10 years) at Rs 250/day.", category: "Safety" },
  { q: "Do I need to report minor damage immediately?", a: "Yes, report any damage, even scratches, before returning. Minor damage may affect deposit. Photos help. Honest reporting avoids disputes.", category: "Insurance" },
  { q: "What happens if I lock keys inside the car?", a: "Call our 24/7 support +230 5835 7166. Locksmith service fee: Rs 1,500. Spare key available at our office if nearby.", category: "Emergency" },
  { q: "Are pets allowed in rental cars?", a: "Pets allowed with prior approval. Additional cleaning fee: Rs 1,000. Must use pet carrier. Report any mess before return.", category: "Vehicle" },
  { q: "Where can I find police stations in Mauritius?", a: "Main stations: Port Louis (Line Barracks), Curepipe (St Jean), Plaine Magnien (Airport), Grand Baie (Royal Road). All open 24/7. Emergency: 999.", category: "Emergency" },
  { q: "What are the hospital emergency contacts?", a: "Ambulance: 114, SAMU: 112. Major hospitals: Wellkin (Moka) +230 605 1000, Apollo Bramwell (Moka) +230 605 2000, SSR National (Pamplemousses) +230 206 1000.", category: "Emergency" }
];

const categories = ["All", "Booking", "Payment", "Policy", "Insurance", "Driver", "Vehicle", "Support", "Documents", "Law", "Safety", "Emergency", "Parking", "Tourism", "Accessibility"];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredData = faqData.filter((f) => {
    const matchesSearch = f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2f6df6] via-[#eef4ff] to-[#f24949] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-5 py-2 mb-4">
            <HelpCircle size={16} className="text-red-600" />
            <span className="text-sm text-black font-bold">Got Questions?</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black drop-shadow-md">
            Frequently Asked Questions
          </h1>
          <p className="text-black/70 mt-3 font-medium">Everything you need to know about renting with AM38 in Mauritius</p>
        </motion.div>

        {/* TOP CTA BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex justify-center mb-8"
        >
          <Link
            to="/support"
            className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-xl font-bold text-white hover:from-red-700 hover:to-red-800 transition shadow-lg shadow-red-600/30 inline-flex items-center gap-2"
          >
            <Phone size={18} />
            Need More Help?
          </Link>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
          />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-white text-black/80 hover:bg-gray-100 shadow"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition shadow-md border border-gray-100"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-bold">
                        {item.category}
                      </span>
                      <span className="font-semibold text-black">{item.q}</span>
                    </div>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow"
          >
            <HelpCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">No questions found matching your search.</p>
            <p className="text-gray-400 text-sm mt-1">Try different keywords or browse categories</p>
          </motion.div>
        )}

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl text-center shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-white/90 mb-4">Our support team is ready to help you 24/7</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/23058357166"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </a>
            <a
              href="tel:+23058357166"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              <Phone size={18} /> Call Support
            </a>
            <Link
              to="/support"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              <HelpCircle size={18} /> Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}