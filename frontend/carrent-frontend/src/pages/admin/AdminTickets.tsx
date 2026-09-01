import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Paperclip,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  Flag,
  Trash2,
  Edit,
  Archive,
  Download,
  Upload,
  Image,
  FileText,
  X,
} from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface TicketMessage {
  id: number;
  ticket_id: number;
  message: string;
  is_admin: boolean;
  created_at: string;
  attachments?: string[];
}

interface Ticket {
  id: number;
  reference: string;
  booking_id?: number | null;
  title: string;
  type: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed" | "pending";
  priority: "low" | "medium" | "high" | "urgent";
  severity: "minor" | "major" | "critical";
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  category: string;
  attachments?: string[];
  metadata?: Record<string, any>;
}

const statusConfig = {
  open: { label: "Open", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: AlertCircle },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-800 border-gray-200", icon: XCircle },
  pending: { label: "Pending", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Clock },
};

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-700", icon: Flag },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700", icon: Flag },
  high: { label: "High", color: "bg-orange-100 text-orange-700", icon: Flag },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700", icon: Flag },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  booking: { label: "Booking Issue", color: "bg-blue-100 text-blue-700" },
  payment: { label: "Payment Problem", color: "bg-green-100 text-green-700" },
  technical: { label: "Technical Issue", color: "bg-purple-100 text-purple-700" },
  accident: { label: "Accident Report", color: "bg-red-100 text-red-700" },
  deposit: { label: "Deposit Refund", color: "bg-orange-100 text-orange-700" },
  dispute: { label: "Dispute", color: "bg-pink-100 text-pink-700" },
  general: { label: "General Inquiry", color: "bg-gray-100 text-gray-700" },
  carwash: { label: "Car Wash Request", color: "bg-teal-100 text-teal-700" },
  maintenance: { label: "Maintenance Request", color: "bg-indigo-100 text-indigo-700" },
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTickets, setExpandedTickets] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create ticket form state
  const [newTicket, setNewTicket] = useState({
    title: "",
    type: "general",
    priority: "medium",
    description: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    booking_id: "",
  });
  const [createAttachments, setCreateAttachments] = useState<File[]>([]);

  async function loadTickets() {
    setRefreshing(true);
    try {
      // FIXED: Using fetchAPI instead of api.get
      const data = await fetchAPI("/admin/tickets");
      setTickets(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function loadTicketMessages(ticketId: number) {
    try {
      // FIXED: Using fetchAPI instead of api.get
      const data = await fetchAPI(`/admin/tickets/${ticketId}/messages`);
      setMessages(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      loadTicketMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  async function createTicket(e: React.FormEvent) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", newTicket.title);
      formData.append("type", newTicket.type);
      formData.append("priority", newTicket.priority);
      formData.append("description", newTicket.description);
      formData.append("customer_name", newTicket.customer_name);
      formData.append("customer_email", newTicket.customer_email);
      formData.append("customer_phone", newTicket.customer_phone);
      if (newTicket.booking_id) formData.append("booking_id", newTicket.booking_id);
      createAttachments.forEach((file) => formData.append("attachments", file));

      // FIXED: Using fetchAPI instead of api.post
      await fetchAPI("/admin/tickets", {
        method: "POST",
        body: formData,
        headers: {},
      });
      await loadTickets();
      setShowCreateModal(false);
      resetCreateForm();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      const formData = new FormData();
      formData.append("message", replyMessage);
      replyAttachments.forEach((file) => formData.append("attachments", file));

      // FIXED: Using fetchAPI instead of api.post
      await fetchAPI(`/admin/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        body: formData,
        headers: {},
      });
      setReplyMessage("");
      setReplyAttachments([]);
      await loadTicketMessages(selectedTicket.id);
      await loadTickets();
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please try again.");
    }
  }

  async function updateTicketStatus(id: number, status: string) {
    try {
      // FIXED: Using fetchAPI with PATCH method
      await fetchAPI(`/admin/tickets/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadTickets();
      if (selectedTicket?.id === id) {
        setSelectedTicket({ ...selectedTicket, status: status as any });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status.");
    }
  }

  async function updateTicketPriority(id: number, priority: string) {
    try {
      // FIXED: Using fetchAPI with PATCH method
      await fetchAPI(`/admin/tickets/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ priority }),
      });
      await loadTickets();
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  }

  async function assignTicket(id: number, assignee: string) {
    try {
      // FIXED: Using fetchAPI with POST method
      await fetchAPI(`/admin/tickets/${id}/assign`, {
        method: "POST",
        body: JSON.stringify({ assigned_to: assignee }),
      });
      await loadTickets();
    } catch (error) {
      console.error("Failed to assign ticket:", error);
    }
  }

  function resetCreateForm() {
    setNewTicket({
      title: "",
      type: "general",
      priority: "medium",
      description: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      booking_id: "",
    });
    setCreateAttachments([]);
  }

  const toggleExpand = (id: number) => {
    setExpandedTickets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.reference.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customer_email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
      const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
      const matchesType = filterType === "all" || ticket.type === filterType;
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  }, [tickets, search, filterStatus, filterPriority, filterType]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    closed: tickets.filter(t => t.status === "closed").length,
    urgent: tickets.filter(t => t.priority === "urgent").length,
    high: tickets.filter(t => t.priority === "high").length,
  }), [tickets]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading tickets...</p>
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
                <Ticket className="text-red-500" size={28} />
                Ticket Management System
              </h1>
              <p className="text-gray-500 mt-1">Manage customer support tickets, track issues, and respond efficiently</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadTickets}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg transition"
              >
                <Plus size={18} /> New Ticket
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <StatCard title="Total" value={stats.total} icon={Ticket} color="blue" />
          <StatCard title="Open" value={stats.open} icon={AlertCircle} color="yellow" />
          <StatCard title="In Progress" value={stats.inProgress} icon={Clock} color="blue" />
          <StatCard title="Resolved" value={stats.resolved} icon={CheckCircle} color="green" />
          <StatCard title="Closed" value={stats.closed} icon={XCircle} color="gray" />
          <StatCard title="Urgent" value={stats.urgent} icon={Flag} color="red" />
          <StatCard title="High Priority" value={stats.high} icon={Flag} color="orange" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                placeholder="Search by title, reference, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">All Types</option>
              {Object.entries(typeConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTickets.map((ticket) => {
              const status = statusConfig[ticket.status];
              const priority = priorityConfig[ticket.priority];
              const type = typeConfig[ticket.type];
              const StatusIcon = status.icon;
              const PriorityIcon = priority.icon;
              const isExpanded = expandedTickets.has(ticket.id);

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="p-5">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="text-sm font-mono font-bold text-gray-500">{ticket.reference}</span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
                            <StatusIcon size={12} /> {status.label}
                          </span>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${priority.color}`}>
                            <PriorityIcon size={12} /> {priority.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${type.color}`}>
                            {type.label}
                          </span>
                          {ticket.booking_id && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                              Booking #{ticket.booking_id}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-black text-gray-900">{ticket.title}</h3>
                        <p className={`text-gray-600 text-sm mt-2 ${isExpanded ? "" : "line-clamp-2"}`}>
                          {ticket.description}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><User size={12} /> {ticket.customer_name}</span>
                          <span className="flex items-center gap-1"><Mail size={12} /> {ticket.customer_email}</span>
                          {ticket.customer_phone && <span className="flex items-center gap-1"><Phone size={12} /> {ticket.customer_phone}</span>}
                          <span className="flex items-center gap-1"><Calendar size={12} /> Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                          {ticket.assigned_to && <span className="flex items-center gap-1"><Tag size={12} /> Assigned to: {ticket.assigned_to}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleExpand(ticket.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowDetailsModal(true);
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition text-sm"
                        >
                          <Eye size={14} /> View
                        </button>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-100"
                        >
                          <div className="flex flex-wrap gap-3">
                            <select
                              value={ticket.status}
                              onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            >
                              <option value="open">Open</option>
                              <option value="in-progress">In Progress</option>
                              <option value="pending">Pending</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                            <select
                              value={ticket.priority}
                              onChange={(e) => updateTicketPriority(ticket.id, e.target.value)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                              <option value="urgent">Urgent</option>
                            </select>
                            <button
                              onClick={() => assignTicket(ticket.id, "current_admin")}
                              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition"
                            >
                              Assign to Me
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredTickets.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <Ticket size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400">No tickets found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-black">Create New Ticket</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={createTicket} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    required
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type *</label>
                    <select
                      required
                      value={newTicket.type}
                      onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    >
                      {Object.entries(typeConfig).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority *</label>
                    <select
                      required
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={newTicket.customer_name}
                      onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer Email *</label>
                    <input
                      type="email"
                      required
                      value={newTicket.customer_email}
                      onChange={(e) => setNewTicket({ ...newTicket, customer_email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer Phone</label>
                    <input
                      type="tel"
                      value={newTicket.customer_phone}
                      onChange={(e) => setNewTicket({ ...newTicket, customer_phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Booking ID (optional)</label>
                    <input
                      type="text"
                      value={newTicket.booking_id}
                      onChange={(e) => setNewTicket({ ...newTicket, booking_id: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Attachments</label>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Paperclip size={14} /> Add Files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          setCreateAttachments([...createAttachments, ...Array.from(e.target.files)]);
                        }
                      }}
                    />
                  </div>
                  {createAttachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {createAttachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                          <FileText size={12} />
                          {file.name}
                          <button
                            type="button"
                            onClick={() => setCreateAttachments(createAttachments.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition">
                    Create Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black">{selectedTicket.title}</h2>
                  <p className="text-xs text-gray-400">{selectedTicket.reference}</p>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                      className="mt-1 w-full px-2 py-1 border rounded-lg text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Priority</label>
                    <select
                      value={selectedTicket.priority}
                      onChange={(e) => updateTicketPriority(selectedTicket.id, e.target.value)}
                      className="mt-1 w-full px-2 py-1 border rounded-lg text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Type</label>
                    <p className="mt-1 text-sm font-medium">{typeConfig[selectedTicket.type]?.label || selectedTicket.type}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Created</label>
                    <p className="mt-1 text-sm">{new Date(selectedTicket.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Customer</label>
                    <p className="mt-1 text-sm">{selectedTicket.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="mt-1 text-sm">{selectedTicket.customer_email}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                {/* Messages */}
                <div>
                  <h3 className="font-bold mb-3">Conversation</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl p-3 ${msg.is_admin ? "bg-red-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <p className="text-xs mt-1 opacity-70">{new Date(msg.created_at).toLocaleString()}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {msg.attachments.map((att, idx) => (
                                <a key={idx} href={att} target="_blank" rel="noreferrer" className="text-xs underline opacity-80">
                                  Attachment {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Form */}
                <form onSubmit={sendReply} className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-700">Reply to Customer</label>
                  <textarea
                    rows={3}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
                      <Send size={16} /> Send Reply
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color] || colors.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-black">{value.toLocaleString()}</div>
          <div className="text-xs uppercase tracking-wide mt-1">{title}</div>
        </div>
        <Icon size={24} className="opacity-50" />
      </div>
    </div>
  );
}