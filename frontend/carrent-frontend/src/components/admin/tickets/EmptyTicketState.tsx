import { Ticket, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyTicketStateProps {
  onNewTicket?: () => void;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyTicketState({ onNewTicket, hasFilters, onClearFilters }: EmptyTicketStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16 bg-white rounded-2xl border border-gray-200"
    >
      <Ticket size={48} className="mx-auto text-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {hasFilters ? "No tickets match your filters" : "No tickets yet"}
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        {hasFilters 
          ? "Try adjusting your search or filter criteria" 
          : "Create your first support ticket to get started"}
      </p>
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear all filters
        </button>
      )}
      {!hasFilters && onNewTicket && (
        <button
          onClick={onNewTicket}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg transition"
        >
          <Plus size={16} /> Create New Ticket
        </button>
      )}
    </motion.div>
  );
}