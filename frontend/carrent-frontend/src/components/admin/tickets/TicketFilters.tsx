import { Search, Filter, X } from "lucide-react";
import { TICKET_TYPE_CONFIG } from "@/constants/ticket.constants";

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function TicketFilters({
  search,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  filterType,
  onFilterTypeChange,
  onClearFilters,
  hasActiveFilters,
}: TicketFiltersProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            placeholder="Search by title, reference, customer..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none transition cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => onFilterPriorityChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none transition cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none transition cursor-pointer"
        >
          <option value="all">All Types</option>
          {Object.entries(TICKET_TYPE_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filterStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                Status: {filterStatus}
                <button onClick={() => onFilterStatusChange("all")} className="hover:text-blue-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {filterPriority !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                Priority: {filterPriority}
                <button onClick={() => onFilterPriorityChange("all")} className="hover:text-orange-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {filterType !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                Type: {filterType}
                <button onClick={() => onFilterTypeChange("all")} className="hover:text-purple-900">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
          >
            <X size={14} /> Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}