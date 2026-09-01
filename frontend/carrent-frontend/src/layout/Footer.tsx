import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  Plane,
  CreditCard,
  MessageCircle,
  Clock3,
  Award,
  ChevronRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-br from-[#050816] via-[#071226] to-[#140510] text-white mt-auto">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[120px]" />
      </div>

      {/* TOP STRIP */}
      <div className="relative z-10 border-b border-white/10 bg-white/[0.03] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-sm">
          
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-semibold text-green-300">
              LIVE Mauritius Car Rental Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-white/70">
            <div className="flex items-center gap-2">
              <Plane size={15} />
              SSR Airport Delivery
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={15} />
              24/7 Support
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck size={15} />
              Secure Booking
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-4">
            <img
              src="/am38-logo.png"
              alt="AM38"
              className="h-16 rounded-2xl bg-white p-2 shadow-2xl"
            />

            <div>
              <h2 className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  AM38
                </span>
              </h2>

              <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                Mauritius Mobility
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-white/70">
            Premium Mauritius vehicle rental experience with airport delivery,
            smart booking technology, luxury fleet and trusted island support.
          </p>

          {/* PAYMENT */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
              Secure Payments
            </p>

            <div className="flex flex-wrap gap-3">
              {["Visa", "Mastercard", "Stripe", "Bank", "Cash"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="mb-5 text-lg font-black">
            Navigation
          </h3>

          <div className="space-y-4 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/cars", label: "Fleet" },
              { to: "/explore", label: "Explore Mauritius" },
              { to: "/partners", label: "Partners" },
              { to: "/faq", label: "FAQ" },
              { to: "/about", label: "About Us" },
              { to: "/support", label: "Support" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-2 text-white/70 transition hover:text-white"
              >
                <ChevronRight
                  size={14}
                  className="transition group-hover:translate-x-1"
                />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* WHY AM38 */}
        <div>
          <h3 className="mb-5 text-lg font-black">
            Why Choose AM38
          </h3>

          <div className="space-y-4">

            {[
              "No hidden fees",
              "Airport delivery",
              "Fast booking confirmation",
              "Premium maintained fleet",
              "24/7 WhatsApp support",
              "Tourism assistance",
              "Flexible pickup & dropoff",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-sm text-white/70"
              >
                <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
                  <ShieldCheck
                    size={14}
                    className="text-green-400"
                  />
                </div>

                <span>{item}</span>
              </div>
            ))}

            {/* GOOGLE RATING */}
            <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="flex items-center gap-3">
                <Award className="text-yellow-300" />

                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-yellow-300 text-yellow-300"
                      />
                    ))}
                  </div>

                  <p className="mt-1 text-sm font-bold text-yellow-200">
                    Google Rated Excellence
                  </p>

                  <p className="text-xs text-yellow-100/70">
                    2024 • 2025 Trusted Service Award
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="mb-5 text-lg font-black">
            Contact
          </h3>

          <div className="space-y-5 text-sm">

            <div className="flex gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <Phone size={18} />
              </div>

              <div>
                <p className="font-bold">Phone</p>
                <p className="text-white/60">
                  +230 5835 7166
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <Mail size={18} />
              </div>

              <div>
                <p className="font-bold">Email</p>
                <p className="text-white/60">
                  support@am38.com
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl bg-white/10 p-3">
                <MapPin size={18} />
              </div>

              <div>
                <p className="font-bold">
                  Office
                </p>

                <p className="text-white/60">
                  Plaine Magnien,
                  Mauritius
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="rounded-xl bg-green-500/20 p-3">
                <MessageCircle
                  size={18}
                  className="text-green-400"
                />
              </div>

              <div>
                <p className="font-bold">
                  WhatsApp
                </p>

                <p className="text-white/60">
                  Available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-sm text-white/50 md:flex-row">
          
          <div>
            © 2026 AM38 Rent A Car • Mauritius
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/terms"
              className="hover:text-white"
            >
              Terms
            </Link>

            <Link
              to="/faq"
              className="hover:text-white"
            >
              FAQ
            </Link>

            <Link
              to="/support"
              className="hover:text-white"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
