import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  type View,
  type Event as RBCEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addDays,
  differenceInCalendarDays,
  isSameDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  CarFront,
  Ticket,
  Wrench,
  Sparkles,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface CalendarEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "booking" | "ticket" | "maintenance" | "wash" | "event";
  status: string;
  reference: string;
  customerName?: string;
  carName?: string;
  priority?: string;
}

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function eventColor(event: CalendarEvent): string {
  if (event.type === "booking") {
    if (event.status === "confirmed") return "#10b981";
    if (event.status === "pending") return "#f59e0b";
    if (event.status === "completed") return "#3b82f6";
    if (event.status === "cancelled") return "#ef4444";
    return "#6b7280";
  }
  if (event.type === "ticket") {
    if (event.priority === "urgent") return "#dc2626";
    if (event.priority === "high") return "#f97316";
    if (event.status === "open") return "#eab308";
    if (event.status === "resolved") return "#10b981";
    return "#6b7280";
  }
  if (event.type === "maintenance") return "#8b5cf6";
  if (event.type === "wash") return "#06b6d4";
  return "#3b82f6";
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>(Views.MONTH);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  async function loadCalendarData() {
    setLoading(true);
    try {
      const [bookings, tickets] = await Promise.all([
        fetchAPI("/admin/bookings").catch(() => []),
        fetchAPI("/admin/tickets").catch(() => []),
      ]);

      // ========== FIXED: use real field names ==========
      const bookingEvents: CalendarEvent[] = (Array.isArray(bookings) ? bookings : bookings?.data || []).map((b: any) => ({
        id: `booking-${b.id}`,
        title: `${b.car_name || "Vehicle"} - ${b.first_name || ""} ${b.surname || ""}`.trim(),
        start: new Date(b.pickup_date || new Date()),
        end: new Date(b.return_date || addDays(new Date(), 1)),
        type: "booking",
        status: b.status || "pending",
        reference: b.reference || `BK-${b.id}`,
        customerName: `${b.first_name || ""} ${b.surname || ""}`.trim(),
        carName: b.car_name,
      }));
      // =================================================

      const ticketEvents: CalendarEvent[] = (Array.isArray(tickets) ? tickets : tickets?.data || []).map((t: any) => ({
        id: `ticket-${t.id}`,
        title: `${t.title || "Ticket"} - ${t.customer_name || "Customer"}`,
        start: new Date(t.created_at || new Date()),
        end: new Date(t.created_at || new Date()),
        type: "ticket",
        status: t.status || "open",
        reference: t.reference || `TKT-${t.id}`,
        customerName: t.customer_name,
        priority: t.priority,
      }));

      setEvents([...bookingEvents, ...ticketEvents]);
    } catch (error) {
      console.error("Failed to load calendar data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCalendarData();
  }, []);

  const eventStyleGetter = (event: RBCEvent) => {
    const calendarEvent = event as CalendarEvent;
    return {
      style: {
        backgroundColor: eventColor(calendarEvent),
        borderRadius: "8px",
        border: "none",
        padding: "2px 6px",
        fontSize: "12px",
        fontWeight: 500,
        color: "#fff",
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    const today = new Date();
    if (isSameDay(date, today)) {
      return {
        style: {
          backgroundColor: "#fef3c7",
          borderColor: "#f59e0b",
        },
      };
    }
    const eventCount = events.filter(e => isSameDay(e.start, date)).length;
    if (eventCount > 5) {
      return {
        style: {
          backgroundColor: "#fee2e2",
          borderColor: "#ef4444",
        },
      };
    }
    if (eventCount > 2) {
      return {
        style: {
          backgroundColor: "#fef9c3",
          borderColor: "#eab308",
        },
      };
    }
    return {};
  };

  const handleSelectEvent = (event: RBCEvent) => {
    setSelectedEvent(event as CalendarEvent);
    setShowEventModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading calendar...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
                <CalendarDays className="text-red-500" size={28} />
                Master Calendar
              </h1>
              <p className="text-gray-500 mt-1">View all bookings, tickets, and events in one unified calendar</p>
            </div>
            <button
              onClick={loadCalendarData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-sm">Confirmed Booking</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-sm">Pending Booking</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-sm">Completed Booking</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-sm">Cancelled Booking / Urgent Ticket</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-sm">Open Ticket</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-sm">Wash/Maintenance</span></div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={(nextView: View) => setView(nextView)}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            style={{ height: 700 }}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            onSelectEvent={handleSelectEvent}
            popup
            messages={{
              next: "Next",
              previous: "Previous",
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
              agenda: "Agenda",
            }}
          />
        </div>

        {/* Event Count Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-blue-600">{events.filter(e => e.type === "booking").length}</div>
            <div className="text-xs text-gray-500">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-orange-600">{events.filter(e => e.type === "booking" && e.status === "pending").length}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-green-600">{events.filter(e => e.type === "booking" && e.status === "confirmed").length}</div>
            <div className="text-xs text-gray-500">Confirmed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-purple-600">{events.filter(e => e.type === "ticket" && e.status === "open").length}</div>
            <div className="text-xs text-gray-500">Open Tickets</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-black text-red-600">{events.filter(e => e.type === "ticket" && e.priority === "urgent").length}</div>
            <div className="text-xs text-gray-500">Urgent Tickets</div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: eventColor(selectedEvent) }} />
                <h3 className="text-xl font-black text-gray-900">{selectedEvent.title}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium capitalize">{selectedEvent.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium capitalize">{selectedEvent.status}</span>
                </div>
                {selectedEvent.reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference:</span>
                    <span className="font-mono text-sm">{selectedEvent.reference}</span>
                  </div>
                )}
                {selectedEvent.customerName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer:</span>
                    <span>{selectedEvent.customerName}</span>
                  </div>
                )}
                {selectedEvent.carName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehicle:</span>
                    <span>{selectedEvent.carName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>{format(selectedEvent.start, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span>{format(selectedEvent.start, "p")} - {format(selectedEvent.end, "p")}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                {selectedEvent.type === "booking" && (
                  <a
                    href={`/admin/reservations?id=${selectedEvent.id.split("-")[1]}`}
                    className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                  >
                    View Booking
                  </a>
                )}
                {selectedEvent.type === "ticket" && (
                  <a
                    href={`/admin/tickets?id=${selectedEvent.id.split("-")[1]}`}
                    className="flex-1 text-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                  >
                    View Ticket
                  </a>
                )}
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}