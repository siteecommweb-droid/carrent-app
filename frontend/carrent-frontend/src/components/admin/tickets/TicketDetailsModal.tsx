import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Calendar, User, Mail, Phone, Tag, Flag, Clock, AlertCircle } from "lucide-react";
import { Ticket, TicketMessage } from "@/types/ticket.types";
import { getTicketStatusInfo, getTicketPriorityInfo, getTicketTypeInfo, isTicketOverdue } from "@/utils/ticket.utils";
import { TicketConversation } from "./TicketConversation";
import { TicketReplyForm } from "./TicketReplyForm";

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  messages: TicketMessage[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  onUpdatePriority: (id: number, priority: string) => void;
  onSendReply: (message: string, attachments: File[]) => Promise<void>;
  isSending?: boolean;
  isLoadingMessages?: boolean;
}

export function TicketDetailsModal({
  ticket,
  messages,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onSendReply,
  isSending,
  isLoadingMessages,
}: TicketDetailsModalProps) {
  if (!ticket) return null;

  const status = getTicketStatusInfo(ticket.status);
  const priority = getTicketPriorityInfo(ticket.priority);
  const type = getTicketTypeInfo(ticket.type);
  const isOverdue = isTicketOverdue(ticket);

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
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-gray-900">{ticket.title}</h2>
                  {isOverdue && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 animate-pulse">
                      <AlertCircle size={12} /> SLA Overdue
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{ticket.reference}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-70px)] p-6 space-y-6">
              {/* Ticket Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
                    className="mt-1 w-full px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1">Priority</label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => onUpdatePriority(ticket.id, e.target.value)}
                    className="mt-1 w-full px-2 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Type</label>
                  <p className="mt-1 text-sm font-medium">{type.label}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Created</label>
                  <p className="mt-1 text-sm">{new Date(ticket.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Customer</label>
                  <p className="mt-1 text-sm font-medium">{ticket.customer_name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="mt-1 text-sm">{ticket.customer_email}</p>
                </div>
                {ticket.customer_phone && (
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <p className="mt-1 text-sm">{ticket.customer_phone}</p>
                  </div>
                )}
                {ticket.booking_id && (
                  <div>
                    <label className="text-xs text-gray-500">Booking ID</label>
                    <p className="mt-1 text-sm font-mono">#{ticket.booking_id}</p>
                  </div>
                )}
                {ticket.assigned_to && (
                  <div>
                    <label className="text-xs text-gray-500">Assigned To</label>
                    <p className="mt-1 text-sm">{ticket.assigned_to}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                  {ticket.description}
                </p>
              </div>

              {/* Conversation */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Conversation</h3>
                <TicketConversation messages={messages} isLoading={isLoadingMessages} />
              </div>

              {/* Reply Form */}
              <TicketReplyForm onSendReply={onSendReply} isSending={isSending} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}