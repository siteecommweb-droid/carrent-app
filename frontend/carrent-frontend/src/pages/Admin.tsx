import { useMemo, useState } from "react";
import {
  CarFront,
  FileText,
  Search,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Users,
  Wrench,
  Mail,
  Bell,
  CalendarDays,
  Activity,
  BarChart3,
  Download,
  Sparkles,
} from "lucide-react";
import { cars as fleetCars } from "@/data/cars";
import { useBooking } from "@/context/BookingContext";
import { formatDateTime, formatMUR } from "@/utils/booking";

type FleetRow = {
  plate: string;
  car: string;
  status: string;
  note: string;
  zone: string;
  avGroup: string;
  health: number;
  nextService: string;
};

const fallbackOperationalRows: FleetRow[] = [
  { plate: "1234 MR 25", car: "Toyota Vitz", status: "Available", note: "Ready now", zone: "Airport", avGroup: "CDAV", health: 94, nextService: "2026-06-10" },
  { plate: "4567 MR 25", car: "Suzuki Swift", status: "Available", note: "Ready now", zone: "Airport", avGroup: "CDAV", health: 91, nextService: "2026-06-12" },
  { plate: "8899 MR 25", car: "Hyundai Venue", status: "Car wash", note: "Available after 14:00", zone: "Wash Bay", avGroup: "CFAR", health: 88, nextService: "2026-06-18" },
  { plate: "5522 MR 25", car: "Suzuki Ertiga", status: "Mechanic", note: "Check brakes", zone: "Workshop", avGroup: "SVAR", health: 62, nextService: "2026-05-15" },
  { plate: "7788 MR 25", car: "Hyundai Tucson", status: "Available", note: "Ready now", zone: "Airport", avGroup: "IFAR", health: 96, nextService: "2026-06-25" },
  { plate: "9900 MR 25", car: "Kia Picanto", status: "Booked", note: "Pickup 14:00", zone: "Allocated", avGroup: "EDAV", health: 83, nextService: "2026-06-02" },
];

function getStatusColor(status: string) {
  const s = status.toLowerCase();
  if (s.includes("book")) return "bg-amber-100 text-amber-800";
  if (s.includes("wash")) return "bg-sky-100 text-sky-800";
  if (s.includes("mechanic")) return "bg-rose-100 text-rose-800";
  if (s.includes("available")) return "bg-emerald-100 text-emerald-800";
  return "bg-gray-100 text-gray-800";
}

export default function Admin() {
  const { bookings, updateBookingStatus } = useBooking();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "fleet" | "bookings" | "operations">("dashboard");

  const fleetStatus: FleetRow[] = useMemo(() => {
    const bookingRows = fleetCars.map((car: any, index: number) => {
      const activeBooking = bookings.find(
        (b: any) =>
          String(b?.car?.id) === String(car.id) &&
          !["cancelled", "completed"].includes(String(b?.status || "").toLowerCase())
      );

      return {
        plate: `${1000 + index} MR 26`,
        car: car.name,
        status: activeBooking ? "Booked" : "Available",
        note: activeBooking
          ? `${formatDateTime(activeBooking.pickupDate, activeBooking.pickupTime)} → ${formatDateTime(activeBooking.dropoffDate, activeBooking.dropoffTime)}`
          : "Ready now",
        zone: activeBooking ? "Allocated" : "Available",
        avGroup: car.avGroup || "CDAV",
        health: activeBooking ? 82 : 95,
        nextService: "2026-06-30",
      };
    });

    return [...bookingRows, ...fallbackOperationalRows];
  }, [bookings]);

  const filteredFleet = fleetStatus.filter((item) =>
    `${item.car} ${item.plate} ${item.status} ${item.zone}`.toLowerCase().includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    const revenue = bookings.reduce((sum: number, b: any) => sum + (b.price?.grandTotalMUR || 0), 0);
    const pending = bookings.filter((b: any) => b.status?.toLowerCase() === "pending").length;
    const confirmed = bookings.filter((b: any) => b.status?.toLowerCase() === "confirmed").length;
    const cancelled = bookings.filter((b: any) => b.status?.toLowerCase() === "cancelled").length;
    const completed = bookings.filter((b: any) => b.status?.toLowerCase() === "completed").length;
    const availableFleet = fleetStatus.filter((x) => x.status === "Available").length;
    const bookedFleet = fleetStatus.filter((x) => x.status === "Booked").length;
    const fleetUtilization = fleetStatus.length ? Math.round((bookedFleet / fleetStatus.length) * 100) : 0;

    return {
      total: bookings.length,
      revenue,
      pending,
      confirmed,
      cancelled,
      completed,
      availableFleet,
      bookedFleet,
      fleetUtilization,
    };
  }, [bookings, fleetStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#071226] via-[#123b73] to-[#0f172a] text-white py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
            <Sparkles className="h-4 w-4" />
            AM38 Admin Command Center
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-black">Admin Dashboard</h1>
          <p className="mt-3 text-white/70">Bookings, fleet, payments, verification, support and operations intelligence.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "fleet", label: "Fleet Management", icon: CarFront },
            { id: "bookings", label: "Bookings", icon: FileText },
            { id: "operations", label: "Operations", icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 font-bold transition ${
                activeTab === tab.id ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <StatCard title="Total Bookings" value={stats.total} icon={FileText} color="blue" />
              <StatCard title="Revenue" value={formatMUR(stats.revenue)} icon={CreditCard} color="green" />
              <StatCard title="Pending" value={stats.pending} icon={Clock} color="amber" />
              <StatCard title="Confirmed" value={stats.confirmed} icon={CheckCircle} color="emerald" />
              <StatCard title="Fleet Usage" value={`${stats.fleetUtilization}%`} icon={BarChart3} color="teal" />
              <StatCard title="Cancelled" value={stats.cancelled} icon={AlertCircle} color="rose" />
            </div>

            <div className="grid lg:grid-cols-[1fr_420px] gap-6">
              <div className="bg-white rounded-[28px] p-6 shadow-xl border">
                <h2 className="text-2xl font-black mb-5">Quick Actions</h2>
                <div className="grid md:grid-cols-4 gap-3">
                  <ActionButton icon={CarFront} label="+ Add Car" />
                  <ActionButton icon={FileText} label="All Bookings" />
                  <ActionButton icon={Download} label="Export Report" />
                  <ActionButton icon={Users} label="Staff Roles" />
                  <ActionButton icon={Mail} label="Email Inbox" />
                  <ActionButton icon={Bell} label="Notifications" />
                  <ActionButton icon={ShieldCheck} label="Verification" />
                  <ActionButton icon={Wrench} label="Maintenance" />
                </div>
              </div>

              <div className="bg-black text-white rounded-[28px] p-6 shadow-xl">
                <div className="text-2xl font-black">AI Operations Summary</div>
                <div className="mt-5 space-y-3 text-sm text-white/70">
                  <div>✔ Fleet utilization: {stats.fleetUtilization}%</div>
                  <div>✔ Available vehicles: {stats.availableFleet}</div>
                  <div>✔ Booked vehicles: {stats.bookedFleet}</div>
                  <div>✔ Pending reservations: {stats.pending}</div>
                  <div>✔ Revenue tracked: {formatMUR(stats.revenue)}</div>
                  <div>✔ Audit, CRM, support and invoice systems ready</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "fleet" && (
          <>
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by car, plate, status or zone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-[28px] shadow-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold">Car</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Plate</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Group</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Zone</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Health</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Next Service</th>
                      <th className="px-6 py-4 text-left text-sm font-bold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFleet.slice(0, 30).map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-bold">{item.car}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.plate}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{item.avGroup}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{item.zone}</td>
                        <td className="px-6 py-4 text-sm font-bold">{item.health}%</td>
                        <td className="px-6 py-4 text-sm">{item.nextService}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.slice(0, 15).map((b: any) => (
              <div key={b.id} className="bg-white rounded-[28px] p-6 shadow-xl border hover:shadow-2xl transition">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">#{b.id}</p>
                    <h3 className="font-black text-lg">{b.fullName}</h3>
                    <p className="text-sm text-gray-600">{b.car?.name || "Unknown Car"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateBookingStatus(b.id, "confirmed")} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold">
                      Confirm
                    </button>
                    <button onClick={() => updateBookingStatus(b.id, "cancelled")} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold">
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <Info label="Pickup" value={formatDateTime(b.pickupDate, b.pickupTime)} />
                  <Info label="Dropoff" value={formatDateTime(b.dropoffDate, b.dropoffTime)} />
                  <Info label="Total" value={formatMUR(b.price?.grandTotalMUR || 0)} />
                  <div>
                    <div className="text-gray-500">Status</div>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(b.status || "Pending")}`}>
                      {b.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No bookings yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "operations" && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <OperationCard icon={CalendarDays} title="Fleet Calendar" text="Reservation planning, maintenance blocking and vehicle availability." />
            <OperationCard icon={ShieldCheck} title="Verification Queue" text="Approve customer passport, license and selfie checks." />
            <OperationCard icon={Mail} title="Email Inbox" text="Convert emails into bookings, tickets and CRM tasks." />
            <OperationCard icon={Bell} title="Live Notifications" text="Booking alerts, payment alerts and support alerts." />
            <OperationCard icon={Wrench} title="Maintenance Scheduler" text="Car wash, mechanic, inspections and fleet readiness." />
            <OperationCard icon={TrendingUp} title="Analytics" text="Revenue, demand, fleet usage and tourism conversion." />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    teal: "bg-teal-50 text-teal-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border hover:shadow-2xl transition">
      <div className={`rounded-xl p-2 inline-flex ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-2xl font-black">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: any) {
  return (
    <button className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-800 font-bold hover:bg-blue-50 hover:text-blue-700 transition">
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function OperationCard({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-[28px] bg-white border p-6 shadow-xl">
      <Icon className="h-9 w-9 text-blue-600 mb-4" />
      <div className="text-xl font-black">{title}</div>
      <div className="mt-2 text-sm text-black/55">{text}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}