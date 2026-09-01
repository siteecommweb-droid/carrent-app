import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Paperclip, FileText, X } from "lucide-react";
import { TICKET_TYPE_CONFIG } from "@/constants/ticket.constants";
import { AttachmentUploader } from "./AttachmentUploader";
import { validateAndSanitizeTicketInput } from "@/utils/ticket.validators";

interface TicketCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => Promise<void>;
  isCreating?: boolean;
}

export function TicketCreateModal({ isOpen, onClose, onCreate, isCreating }: TicketCreateModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "general",
    priority: "medium",
    description: "",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    booking_id: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validation = validateAndSanitizeTicketInput({
      title: formData.title,
      description: formData.description,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
    });
    
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach(err => {
        if (err.includes("Title")) errorMap.title = err;
        else if (err.includes("Description")) errorMap.description = err;
        else if (err.includes("name")) errorMap.customer_name = err;
        else if (err.includes("email")) errorMap.customer_email = err;
      });
      setErrors(errorMap);
      return;
    }
    
    setErrors({});
    
    const formDataToSend = new FormData();
    formDataToSend.append("title", validation.title);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("priority", formData.priority);
    formDataToSend.append("description", validation.description);
    formDataToSend.append("customer_name", validation.customer_name);
    formDataToSend.append("customer_email", validation.customer_email);
    if (formData.customer_phone) formDataToSend.append("customer_phone", formData.customer_phone);
    if (formData.booking_id) formDataToSend.append("booking_id", formData.booking_id);
    attachments.forEach(file => formDataToSend.append("attachments", file));
    
    await onCreate(formDataToSend);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "general",
      priority: "medium",
      description: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      booking_id: "",
    });
    setAttachments([]);
    setErrors({});
  };

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
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center">
              <h2 className="text-xl font-black">Create New Ticket</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 max-h-[calc(90vh-70px)]">
              <div>
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition ${
                    errors.title ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Brief summary of the issue"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    {Object.entries(TICKET_TYPE_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority *</label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
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
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className={`w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none ${
                      errors.customer_name ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.customer_name && <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className={`w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none ${
                      errors.customer_email ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.customer_email && <p className="text-xs text-red-500 mt-1">{errors.customer_email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Customer Phone</label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Booking ID (optional)</label>
                  <input
                    type="text"
                    value={formData.booking_id}
                    onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="e.g., BK-12345"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full mt-1 px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none ${
                    errors.description ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Detailed description of the issue..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <AttachmentUploader
                onFilesSelected={(files) => setAttachments([...attachments, ...files])}
                existingFiles={attachments}
                onRemoveFile={(idx) => setAttachments(attachments.filter((_, i) => i !== idx))}
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : null}
                  {isCreating ? "Creating..." : "Create Ticket"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}