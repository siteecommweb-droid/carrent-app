import { useEffect, useMemo, useState } from "react";
import {
  getInboxAPI,
  ingestEmailAPI,
  parseEmailAPI,
  createTicketFromEmailAPI,
  createBookingFromEmailAPI,
} from "@/services/api";
import { Mail, Send, Inbox, Ticket, Car, Loader2, RefreshCw, Eye, CheckCircle, XCircle, Brain, FileText, Paperclip, Sparkles, MessageSquare, Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InboxEmail {
  id: number;
  source: string;
  sender_name: string | null;
  sender_email: string | null;
  subject: string;
  raw_text: string;
  parsed_json: any;
  status: string;
  linked_ticket_id: number | null;
  linked_booking_id: number | null;
  created_at: string;
  sentiment?: "positive" | "neutral" | "negative";
  spam_score?: number;
}

export default function AdminEmailInbox() {
  const [emails, setEmails] = useState<InboxEmail[]>([]);
  const [subject, setSubject] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [rawText, setRawText] = useState("");
  const [carId, setCarId] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  async function loadInbox() {
    setRefreshing(true);
    try {
      const data = await getInboxAPI();
      setEmails(Array.isArray(data) ? data : []);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { loadInbox(); }, []);

  const activeEmail = useMemo(() => emails.find((x) => x.id === activeId) || null, [emails, activeId]);

  async function ingestEmail() {
    if (!subject || !rawText) return alert("Please fill subject and body");
    setLoading(true);
    try {
      const data = await ingestEmailAPI({ source: "manual", sender_name: senderName, sender_email: senderEmail, subject, raw_text: rawText });
      if (data?.id) {
        setSubject(""); setSenderName(""); setSenderEmail(""); setRawText("");
        await loadInbox();
        setActiveId(data.id);
      }
    } finally { setLoading(false); }
  }

  async function parseEmail(id: number) {
    setLoading(true);
    try {
      await parseEmailAPI(id);
      await loadInbox();
      setActiveId(id);
      // Simulate AI analysis
      setAiInsights("Customer seems interested in booking a SUV for family trip. Recommend Toyota RAV4.");
      setTimeout(() => setAiInsights(null), 5000);
    } finally { setLoading(false); }
  }

  async function createTicket(id: number) {
    setLoading(true);
    try {
      await createTicketFromEmailAPI(id);
      await loadInbox();
      setActiveId(id);
    } finally { setLoading(false); }
  }

  async function createBooking(id: number) {
    setLoading(true);
    try {
      await createBookingFromEmailAPI(id, carId ? Number(carId) : undefined);
      await loadInbox();
      setActiveId(id);
      setCarId("");
    } finally { setLoading(false); }
  }

  const getSentimentIcon = (sentiment?: string) => {
    if (sentiment === "positive") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (sentiment === "negative") return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="grid lg:grid-cols-[420px_1fr] gap-8">
        {/* LEFT PANEL */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2"><Mail className="h-6 w-6 text-blue-600" /><div className="text-2xl font-black">Email Intake</div></div>
          <p className="text-sm text-gray-500">Add emails manually with AI-powered parsing</p>
          <input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Sender name" className="w-full border rounded-xl px-4 py-3" />
          <input value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="Sender email" className="w-full border rounded-xl px-4 py-3" />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full border rounded-xl px-4 py-3" />
          <textarea value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Paste email body..." className="w-full min-h-[260px] border rounded-xl px-4 py-3" />
          <button onClick={ingestEmail} disabled={loading} className="w-full rounded-xl bg-blue-600 text-white py-3 font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Processing..." : "Add To Inbox"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2"><Inbox className="h-6 w-6 text-blue-600" /><div className="text-2xl font-black">Admin Inbox</div><span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{emails.length}</span></div>
            <button onClick={loadInbox} disabled={refreshing}><RefreshCw className={`h-5 w-5 text-gray-500 ${refreshing ? "animate-spin" : ""}`} /></button>
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] h-[600px]">
            {/* Email List */}
            <div className="border-r overflow-auto">
              {emails.map((mail) => (
                <button key={mail.id} onClick={() => setActiveId(mail.id)} className={`w-full text-left border-b p-4 transition ${activeId === mail.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-gray-50"}`}>
                  <div className="font-bold truncate flex items-center gap-2">{getSentimentIcon(mail.sentiment)}{mail.subject || "(No subject)"}</div>
                  <div className="text-sm text-gray-500 truncate">{mail.sender_email || "Unknown"}</div>
                  <div className="flex justify-between mt-2"><span className={`text-xs px-2 py-1 rounded-full ${mail.status === "processed" ? "bg-green-100 text-green-800" : "bg-gray-100"}`}>{mail.status}</span><span className="text-xs text-gray-400">{new Date(mail.created_at).toLocaleDateString()}</span></div>
                </button>
              ))}
              {emails.length === 0 && <div className="p-8 text-center text-gray-500"><Mail className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No emails yet</p></div>}
            </div>

            {/* Email Detail */}
            <div className="overflow-auto p-6">
              {!activeEmail && <div className="h-full flex items-center justify-center text-gray-400"><Eye className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>Select an email</p></div>}
              {activeEmail && (
                <div className="space-y-6">
                  <div><h2 className="text-2xl font-black">{activeEmail.subject}</h2><div className="text-sm text-gray-500 mt-1">From: {activeEmail.sender_name || "Unknown"} &lt;{activeEmail.sender_email}&gt;</div></div>
                  {aiInsights && (<div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 flex items-start gap-3"><Brain className="h-5 w-5 text-purple-600 mt-0.5" /><div><p className="font-semibold">AI Insight</p><p className="text-sm">{aiInsights}</p></div></div>)}
                  <div className="grid md:grid-cols-2 gap-4">
                    <button onClick={() => parseEmail(activeEmail.id)} className="rounded-xl border-2 border-blue-600 py-3 font-bold text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"><Eye className="h-4 w-4" />Parse with AI</button>
                    <button onClick={() => createTicket(activeEmail.id)} className="rounded-xl bg-purple-600 text-white py-3 font-bold hover:bg-purple-700 flex items-center justify-center gap-2"><Ticket className="h-4 w-4" />Create Ticket</button>
                  </div>
                  <div className="grid md:grid-cols-[1fr_auto] gap-4"><input value={carId} onChange={(e) => setCarId(e.target.value)} placeholder="Car ID (optional)" className="border rounded-xl px-4 py-3" /><button onClick={() => createBooking(activeEmail.id)} className="rounded-xl bg-red-600 text-white py-3 px-6 font-bold hover:bg-red-700 flex items-center justify-center gap-2"><Car className="h-4 w-4" />Create Booking</button></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4"><div className="font-bold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" />Raw Content</div><pre className="text-xs whitespace-pre-wrap font-mono bg-white p-3 rounded-lg border max-h-[300px] overflow-auto">{activeEmail.raw_text || "No content"}</pre></div>
                    <div className="bg-gray-50 rounded-xl p-4"><div className="font-bold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4" />Parsed Data</div><pre className="text-xs whitespace-pre-wrap font-mono bg-white p-3 rounded-lg border max-h-[300px] overflow-auto">{activeEmail.parsed_json ? JSON.stringify(activeEmail.parsed_json, null, 2) : "Not parsed yet"}</pre></div>
                  </div>
                  <button onClick={() => setShowReply(!showReply)} className="flex items-center gap-2 text-blue-600"><MessageSquare className="h-4 w-4" />Quick Reply</button>
                  {showReply && (<div><textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full border rounded-xl p-3 min-h-[100px]" placeholder="Type your reply..." /><div className="flex gap-3 mt-2"><button className="px-4 py-2 bg-blue-600 text-white rounded-xl">Send Reply</button><button className="px-4 py-2 border rounded-xl" onClick={() => setShowReply(false)}>Cancel</button></div></div>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}