import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Car, User, Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, Plane, Fuel, Gauge, AlertCircle } from "lucide-react";
import { CalendarEvent } from "@/types/calendar.types";
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS } from "@/constants/calendar.constants";

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  onAssignDriver?: (eventId: string, driverId: number) => void;
}

export function EventDetailsModal({ event, isOpen, onClose, onEdit, onDelete, onAssignDriver }: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: EVENT_TYPE_COLORS[event.type] }}
                />
                <h2 className="text-xl font-black">{event.title}</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Type</label>
                  <p className="font-medium">{EVENT_TYPE_LABELS[event.type]}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: EVENT_STATUS_COLORS[event.status], color: "#fff" }}
                  >
                    {EVENT_STATUS_LABELS[event.status]}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Reference</label>
                  <p className="font-mono text-sm">{event.reference}</p>
                </div>
                {event.carName && (
                  <div>
                    <label className="text-xs text-gray-500 flex items-center gap-1"><Car size={12} /> Vehicle</label>
                    <p>{event.carName} {event.carPlate && `(${event.carPlate})`}</p>
                  </div>
                )}
                {event.customerName && (
                  <div>
                    <label className="text-xs text-gray-500 flex items-center gap-1"><User size={12} /> Customer</label>
                    <p>{event.customerName}</p>
                    {event.customerEmail && <p className="text-sm text-gray-500">{event.customerEmail}</p>}
                    {event.customerPhone && <p className="text-sm text-gray-500">{event.customerPhone}</p>}
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1"><CalendarIcon size={12} /> Start</label>
                  <p>{new Date(event.start).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> End</label>
                  <p>{new Date(event.end).toLocaleString()}</p>
                </div>
                {event.flightNumber && (
                  <div>
                    <label className="text-xs text-gray-500 flex items-center gap-1"><Plane size={12} /> Flight</label>
                    <p>{event.flightNumber} {event.landingTime && `(Landing: ${event.landingTime})`}</p>
                  </div>
                )}
                {event.pickupLocation && (
                  <div>
                    <label className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Pickup</label>
                    <p>{event.pickupLocation}</p>
                  </div>
                )}
                {event.dropoffLocation && (
                  <div>
                    <label className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Dropoff</label>
                    <p>{event.dropoffLocation}</p>
                  </div>
                )}
                {event.fuelLevel !== undefined && (
                  <div>
                    <label className="text-xs text-gray-500 flex items-center gap-1"><Fuel size={12} /> Fuel Level</label>
                    <p>{event.fuelLevel}%</p>
                  </div>
                )}
                {event.mileage !== undefined && (
                  <div>
                    <label className="text-xs text-gray-500 flex items-center gap-1"><Gauge size={12} /> Mileage</label>
                    <p>{event.mileage.toLocaleString()} km</p>
                  </div>
                )}
                {event.driverName && (
                  <div>
                    <label className="text-xs text-gray-500">Driver</label>
                    <p>{event.driverName}</p>
                  </div>
                )}
                {event.notes && (
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500">Notes</label>
                    <p className="text-sm bg-gray-50 p-2 rounded-lg">{event.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {onEdit && (
                  <button
                    onClick={() => onEdit(event)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                  >
                    Edit Event
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(event.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                  >
                    Delete Event
                  </button>
                )}
                <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition">
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}