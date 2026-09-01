import { motion } from "framer-motion";
import { Ticket, Eye, ChevronDown, ChevronUp, User, Mail, Phone, Calendar, Tag, Flag } from "lucide-react";
import { Ticket as TicketType } from "@/types/ticket.types";
import { getTicketStatusInfo, getTicketPriorityInfo, getTicketTypeInfo, isTicketOverdue, getTicketSLAStatus } from "@/utils/ticket.utils";

interface TicketCardProps {
  ticket: TicketType;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  onViewDetails: (ticket: TicketType) => void;
  onStatusChange?: (id: number, status: string) => void;
  onPriorityChange?: (id: number, priority: string) => void;
  onAssign?: (id: number, assignee: string) => void;
}

export function TicketCard({ 
  ticket, 
  isExpanded, 
  onToggleExpand, 
  onViewDetails,
  onStatusChange,
  onPriorityChange,
  onAssign
}: TicketCardProps) {
  const status = getTicketStatusInfo(ticket.status);
  const priority = getTicketPriorityInfo(ticket.priority);
  const type = getTicketTypeInfo(ticket.type);
  const isOverdue = isTicketOverdue(ticket);
  const slaStatus = getTicketSLAStatus(ticket);
  const StatusIcon = status.icon;
  const PriorityIcon = priority.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className="p-5">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-mono font-bold text-gray-400">{ticket.reference}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.bgColor} ${status.color} border ${status.borderColor}`}>
                <StatusIcon size={12} /> {status.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${priority.bgColor} ${priority.color}`}>
                <PriorityIcon size={12} /> {priority.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${type.bgColor} ${type.color}`}>
                {type.icon && <type.icon size={12} />} {type.label}
              </span>
              {ticket.booking_id && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                  <Tag size={12} /> Booking #{ticket.booking_id}
                </span>
              )}
              {isOverdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 animate-pulse">
                  <Flag size={12} /> SLA Overdue
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-black text-gray-900 truncate">{ticket.title}</h3>
            
            {/* Description */}
            <p className={`text-gray-600 text-sm mt-2 ${isExpanded ? "" : "line-clamp-2"}`}>
              {ticket.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1"><User size={12} /> {ticket.customer_name}</span>
              <span className="flex items-center gap-1"><Mail size={12} /> {ticket.customer_email}</span>
              {ticket.customer_phone && <span className="flex items-center gap-1"><Phone size={12} /> {ticket.customer_phone}</span>}
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(ticket.created_at).toLocaleDateString()}</span>
              {ticket.assigned_to && <span className="flex items-center gap-1"><Tag size={12} /> Assigned to: {ticket.assigned_to_name || ticket.assigned_to}</span>}
            </div>

            {/* SLA Progress Bar */}
            {slaStatus.status !== "ok" && ticket.status !== "resolved" && ticket.status !== "closed" && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">SLA Deadline</span>
                  <span className={`font-medium ${slaStatus.status === "overdue" ? "text-red-600" : slaStatus.status === "critical" ? "text-orange-600" : "text-yellow-600"}`}>
                    {slaStatus.percentage.toFixed(0)}% used
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      slaStatus.status === "overdue" ? "bg-red-500" : 
                      slaStatus.status === "critical" ? "bg-orange-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${Math.min(100, slaStatus.percentage)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onToggleExpand(ticket.id)}
              className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              onClick={() => onViewDetails(ticket)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
            >
              <Eye size={14} /> View
            </button>
          </div>
        </div>

        {/* Expanded Actions */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="flex flex-wrap gap-3">
              {onStatusChange && (
                <select
                  value={ticket.status}
                  onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              )}
              {onPriorityChange && (
                <select
                  value={ticket.priority}
                  onChange={(e) => onPriorityChange(ticket.id, e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              )}
              {onAssign && (
                <button
                  onClick={() => onAssign(ticket.id, "current_admin")}
                  className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                >
                  Assign to Me
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}