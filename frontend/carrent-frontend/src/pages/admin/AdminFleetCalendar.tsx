import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type View,
  type Event as RBCEvent,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  differenceInCalendarDays,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CarFront,
  Wrench,
  Sparkles,
  ShieldAlert,
  RefreshCw,
  Clock,
  AlertCircle,
} from "lucide-react";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type FleetEventType = "booking" | "wash" | "maintenance" | "repair" | "blocked";

interface FleetEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  car: string;
  reference: string;
  customerName: string;
  type: FleetEventType;
  sourceBookingId?: string;
  resource?: { id: number };
}

interface RawBooking {
  id: number | string;
  reference?: string;
  customer_name?: string;
  make?: string;
  model?: string;
  status?: string;
  start_datetime?: string;
  end_datetime?: string;
  start_date?: string;
  end_date?: string;
}

interface MoveArgs {
  event: FleetEvent;
  start: Date | string;
  end: Date | string;
}

const DnDCalendar = withDragAndDrop<FleetEvent, object>(Calendar);

function asDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function buildCarName(b: RawBooking): string {
  return `${b.make || ""} ${b.model || ""}`.trim() || "Fleet Vehicle";
}

function normalizeStatus(status?: string): string {
  const s = String(status || "").toLowerCase();
  if (s.includes("confirm")) return "confirmed";
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("complete")) return "completed";
  if (s.includes("repair")) return "repair";
  if (s.includes("block")) return "blocked";
  return "pending";
}

function eventColor(type: FleetEventType, status: string): string {
  if (type === "wash") return "#eab308";
  if (type === "maintenance") return "#f97316";
  if (type === "repair") return "#dc2626";
  if (type === "blocked") return "#475569";
  if (status === "confirmed") return "#2563eb";
  if (status === "completed") return "#64748b";
  if (status === "cancelled") return "#be123c";
  return "#16a34a";
}

function createFleetEvents(bookings: RawBooking[]): FleetEvent[] {
  const events: FleetEvent[] = [];

  bookings.forEach((b) => {
    const start = asDate(b.start_datetime) || asDate(b.start_date) || new Date();
    const end = asDate(b.end_datetime) || asDate(b.end_date) || addDays(start, 1);
    const status = normalizeStatus(b.status);
    const car = buildCarName(b);
    const reference = String(b.reference || b.id || "");
    const customerName = String(b.customer_name || "Customer");

    events.push({
      id: `booking-${b.id}`,
      title: `${car} • ${reference}`,
      start,
      end,
      status,
      car,
      reference,
      customerName,
      type: "booking",
      sourceBookingId: String(b.id),
      resource: { id: Number(b.id) },
    });

    if (status !== "cancelled") {
      events.push({
        id: `wash-${b.id}`,
        title: `${car} • Wash`,
        start: end,
        end: addDays(end, 1),
        status: "wash",
        car,
        reference,
        customerName,
        type: "wash",
        sourceBookingId: String(b.id),
      });

      events.push({
        id: `maintenance-${b.id}`,
        title: `${car} • Maintenance`,
        start: addDays(end, 1),
        end: addDays(end, 7),
        status: "maintenance",
        car,
        reference,
        customerName,
        type: "maintenance",
        sourceBookingId: String(b.id),
      });
    }
  });

  return events;
}

export default function AdminFleetCalendar() {
  const [events, setEvents] = useState<FleetEvent[]>([]);
  const [selected, setSelected] = useState<FleetEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<View>(Views.MONTH);

  async function loadBookings() {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/bookings`, { headers });
      const data = await res.json();
      setEvents(createFleetEvents(Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function persistMove(e: FleetEvent) {
    if (!e.sourceBookingId || e.type !== "booking") return;

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    await fetch(`${import.meta.env.VITE_API_URL}/admin/bookings/${e.sourceBookingId}/move`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        start_datetime: e.start.toISOString(),
        end_datetime: e.end.toISOString(),
      }),
    });
  }

  const onEventDrop = async (args: MoveArgs) => {
    const start = asDate(args.start) || new Date();
    const end = asDate(args.end) || addDays(start, 1);

    setEvents(events.map((e) => (e.id === args.event.id ? { ...e, start, end } : e)));
    await persistMove({ ...args.event, start, end });
  };

  const onEventResize = async (args: MoveArgs) => {
    const start = asDate(args.start) || new Date();
    const end = asDate(args.end) || addDays(start, 1);

    setEvents(events.map((e) => (e.id === args.event.id ? { ...e, start, end } : e)));
    await persistMove({ ...args.event, start, end });
  };

  const summary = useMemo(() => ({
    bookings: events.filter((e) => e.type === "booking").length,
    wash: events.filter((e) => e.type === "wash").length,
    maintenance: events.filter((e) => e.type === "maintenance").length,
    repair: events.filter((e) => e.type === "repair").length,
  }), [events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Fleet planner</p>
              <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Fleet calendar intelligence
              </h1>
              <p className="text-gray-500 mt-1">
                Bookings, wash buffer, maintenance windows, and fleet visibility in one live planner.
              </p>
            </div>
            <button
              onClick={loadBookings}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-gray-800 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard icon={<CalendarDays className="h-5 w-5" />} label="Bookings" value={summary.bookings} color="blue" />
          <SummaryCard icon={<Sparkles className="h-5 w-5" />} label="Wash" value={summary.wash} color="yellow" />
          <SummaryCard icon={<Wrench className="h-5 w-5" />} label="Maintenance" value={summary.maintenance} color="orange" />
          <SummaryCard icon={<ShieldAlert className="h-5 w-5" />} label="Repair" value={summary.repair} color="red" />
        </div>

        {/* Calendar and Sidebar */}
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor={(event) => event.start}
              endAccessor={(event) => event.end}
              view={view}
              onView={(nextView: View) => setView(nextView)}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              selectable
              resizable
              onEventDrop={onEventDrop}
              onEventResize={onEventResize}
              popup
              style={{ height: 700 }}
              onSelectEvent={(event: RBCEvent) => {
                const fleetEvent = event as FleetEvent;
                if (fleetEvent.type === "booking" && fleetEvent.sourceBookingId) {
                  window.location.href = `/admin/reservations?id=${fleetEvent.sourceBookingId}`;
                } else {
                  setSelected(fleetEvent);
                }
              }}
              eventPropGetter={(event: RBCEvent) => {
                const fleetEvent = event as FleetEvent;
                return {
                  style: {
                    backgroundColor: eventColor(fleetEvent.type, fleetEvent.status),
                    color: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    padding: "2px 6px",
                    fontWeight: 700,
                  },
                };
              }}
            />
          </div>

          <aside className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            {!selected ? (
              <div className="text-center py-8 text-gray-400">
                <CalendarDays size={48} className="mx-auto mb-3 opacity-50" />
                <p>Select a block to inspect it.</p>
                <p className="text-xs mt-1">Click on any event to see details</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: eventColor(selected.type, selected.status) }} />
                  <h2 className="text-2xl font-black text-gray-900">{selected.car}</h2>
                </div>
                <InfoRow label="Reference" value={selected.reference || "-"} />
                <InfoRow label="Customer" value={selected.customerName || "-"} />
                <InfoRow label="Status" value={selected.status || "-"} />
                <InfoRow label="Type" value={selected.type} />
                <InfoRow
                  label="Window"
                  value={`${format(selected.start, "dd MMM yyyy HH:mm")} → ${format(selected.end, "dd MMM yyyy HH:mm")}`}
                />
                <InfoRow label="Duration" value={`${differenceInCalendarDays(selected.end, selected.start) || 1} day(s)`} />
              </div>
            )}
          </aside>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            <span className="ml-2 text-gray-500">Loading events...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-black">{value}</div>
          <div className="text-xs uppercase tracking-wide mt-1">{label}</div>
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-semibold text-gray-900 break-words">{value}</div>
    </div>
  );
}