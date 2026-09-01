// frontend/src/pages/Support.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "@/lib/api";

export default function Support() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");

  const [form, setForm] = useState({
    subject: "",
    type: "general",
    message: "",
    priority: "medium",
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function loadTickets() {
    try {
      const data = await fetchAPI("/tickets/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(ticketId: number) {
    try {
      const data = await fetchAPI(`/tickets/${ticketId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (token) {
      loadTickets();
    }
  }, []);

  async function createTicket() {
    try {
      setSubmitting(true);
      setError("");

      if (!form.subject || !form.message) {
        setError("Please fill all required fields");
        setSubmitting(false);
        return;
      }

      await fetchAPI("/tickets", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          subject: form.subject,
          type: form.type,
          message: form.message,
          priority: form.priority,
        }),
      });

      setSuccess("Support ticket submitted successfully");
      setForm({ subject: "", type: "general", message: "", priority: "medium" });
      loadTickets();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendReply() {
    if (!selectedTicket || !replyText.trim()) return;
    try {
      await fetchAPI(`/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: replyText }),
      });
      setReplyText("");
      await loadMessages(selectedTicket.id);
    } catch (err) {
      console.error(err);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4f7df7] via-[#7ea6ff] to-[#f4d7df] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[35px] shadow-2xl p-10 border border-white/40">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto flex items-center justify-center text-white text-5xl shadow-xl">
              🎫
            </div>
            <h1 className="text-5xl font-black text-slate-900 mt-6">AM38 Support</h1>
            <p className="text-slate-600 mt-4 text-lg leading-relaxed">
              Login required to access secure support tickets and customer assistance.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => navigate("/login")} className="bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-black text-lg hover:scale-105 transition">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-black text-lg hover:scale-105 transition">
                Register
              </button>
            </div>
            <div className="mt-10 bg-slate-100 rounded-3xl p-6 text-left">
              <h3 className="font-black text-slate-900 text-xl mb-4">Why login is required?</h3>
              <ul className="space-y-3 text-slate-700 font-medium">
                <li>✅ Protect customer privacy</li>
                <li>✅ Secure booking support</li>
                <li>✅ View only your own tickets</li>
                <li>✅ Real-time ticket updates</li>
                <li>✅ Faster AM38 support response</li>
                <li>✅ Booking-linked assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4f7df7] via-[#7ea6ff] to-[#f4d7df]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-3 rounded-full text-white font-bold shadow-xl">
              🎫 AM38 Customer Support
            </div>
            <h1 className="text-6xl font-black text-white mt-8">Secure Support Center</h1>
            <p className="text-white/90 text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
              Get help with bookings, payments, Mauritius trips, airport pickups, chauffeur services and premium AM38 customer assistance.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {success && <div className="mb-6 bg-green-100 border border-green-300 text-green-700 rounded-2xl p-4 font-bold">✅ {success}</div>}
        {error && <div className="mb-6 bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 font-bold">❌ {error}</div>}

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[35px] p-8 shadow-2xl border border-white/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white text-3xl shadow-xl">+</div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">Create Ticket</h2>
                <p className="text-slate-600">Logged in as {user?.name || user?.email}</p>
              </div>
            </div>
            <div className="space-y-5">
              <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-black font-semibold outline-none focus:ring-4 focus:ring-blue-300" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-black font-semibold outline-none focus:ring-4 focus:ring-blue-300">
                <option value="general">General Inquiry</option>
                <option value="booking">Booking Support</option>
                <option value="payment">Payment Issue</option>
                <option value="chauffeur">Chauffeur Service</option>
                <option value="airport">Airport Pickup</option>
                <option value="tourism">Tourism Assistance</option>
                <option value="complaint">Complaint</option>
              </select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-black font-semibold outline-none focus:ring-4 focus:ring-blue-300">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
              <textarea rows={8} placeholder="Describe your issue..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-black font-semibold outline-none resize-none focus:ring-4 focus:ring-blue-300" />
              <button onClick={createTicket} disabled={submitting} className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:scale-[1.02] transition-all duration-300 text-white py-5 rounded-2xl font-black text-xl shadow-2xl">
                {submitting ? "Submitting..." : "Submit Support Ticket"}
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-2xl rounded-[35px] p-8 shadow-2xl border border-white/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-3xl shadow-xl">🎫</div>
              <div>
                <h2 className="text-3xl font-black text-slate-900">My Support Tickets</h2>
                <p className="text-slate-600">Your private support history</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-500 font-bold">Loading...</div>
            ) : tickets.length === 0 ? (
              <div className="bg-slate-100 rounded-3xl p-10 text-center">
                <div className="text-6xl">📭</div>
                <h3 className="text-2xl font-black text-slate-800 mt-4">No Tickets Yet</h3>
                <p className="text-slate-500 mt-2">Create your first support request.</p>
              </div>
            ) : (
              <div className="space-y-5 max-h-[700px] overflow-y-auto pr-2">
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => { setSelectedTicket(ticket); loadMessages(ticket.id); }}
                    className="w-full text-left bg-white rounded-3xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">TKT-{String(ticket.id).padStart(5, "0")}</span>
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black uppercase">{ticket.priority || "medium"}</span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase">{ticket.status || "open"}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mt-4">{ticket.subject}</h3>
                        <p className="text-slate-600 mt-3 leading-relaxed">{ticket.message}</p>
                        <div className="mt-5 text-sm text-slate-400 font-semibold">{new Date(ticket.created_at).toLocaleString()}</div>
                        <div className="mt-3 text-sm text-blue-600 font-black">Click to view conversation →</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-[35px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{selectedTicket.subject}</h2>
                <p className="text-sm text-slate-500">TKT-{String(selectedTicket.id).padStart(5, "0")}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              <div className="bg-slate-100 rounded-2xl p-4">
                <p className="text-sm text-slate-800">{selectedTicket.message}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(selectedTicket.created_at).toLocaleString()}</p>
              </div>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender_role === "admin" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-70">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button onClick={sendReply} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}