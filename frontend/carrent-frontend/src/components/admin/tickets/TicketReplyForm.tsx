import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { AttachmentUploader } from "./AttachmentUploader";

interface TicketReplyFormProps {
  onSendReply: (message: string, attachments: File[]) => Promise<void>;
  isSending?: boolean;
}

export function TicketReplyForm({ onSendReply, isSending }: TicketReplyFormProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;
    
    await onSendReply(message, attachments);
    setMessage("");
    setAttachments([]);
  };

  return (
    <form onSubmit={handleSubmit} className="border-t pt-4 mt-4">
      <label className="text-sm font-medium text-gray-700">Reply to Customer</label>
      
      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your response here..."
        disabled={isSending}
        className="w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none disabled:bg-gray-50"
      />
      
      <AttachmentUploader
        onFilesSelected={(files) => setAttachments([...attachments, ...files])}
        existingFiles={attachments}
        onRemoveFile={(idx) => setAttachments(attachments.filter((_, i) => i !== idx))}
      />
      
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={(!message.trim() && attachments.length === 0) || isSending}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <Send size={16} />
          )}
          Send Reply
        </button>
      </div>
    </form>
  );
}