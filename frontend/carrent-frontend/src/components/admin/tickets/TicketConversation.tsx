import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, Paperclip, CheckCircle, MessageSquare } from "lucide-react";
import { TicketMessage } from "@/types/ticket.types";
import { AttachmentPreview } from "./AttachmentPreview";

interface TicketConversationProps {
  messages: TicketMessage[];
  isLoading?: boolean;
}

// ✅ FIXED: Added 'export' before function declaration
export function TicketConversation({ messages, isLoading }: TicketConversationProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-start">
            <div className="max-w-[80%] animate-pulse">
              <div className="h-16 w-64 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No messages yet</p>
        <p className="text-xs">Be the first to respond to this ticket</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {messages.map((msg, idx) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`flex ${msg.is_admin ? "justify-end" : "justify-start"}`}
        >
          <div className={`max-w-[80%] rounded-2xl p-4 ${
            msg.is_admin 
              ? "bg-gradient-to-r from-red-600 to-red-500 text-white" 
              : "bg-gray-100 text-gray-800"
          }`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2 text-xs opacity-80">
              {msg.is_admin ? (
                <>
                  <Shield size={12} />
                  <span>AM38 Support Team</span>
                </>
              ) : (
                <>
                  <User size={12} />
                  <span>Customer</span>
                </>
              )}
              <span>•</span>
              <span>{new Date(msg.created_at).toLocaleString()}</span>
            </div>

            {/* Message */}
            <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>

            {/* Attachments */}
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {msg.attachments.map((att, idx) => (
                  <AttachmentPreview
                    key={idx}
                    url={att}
                    filename={`Attachment ${idx + 1}`}
                    mimeType="application/octet-stream"
                  />
                ))}
              </div>
            )}

            {/* Read Receipt */}
            {msg.is_admin && (
              <div className="flex justify-end mt-1">
                <CheckCircle size={10} className="opacity-50" />
              </div>
            )}
          </div>
        </motion.div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}