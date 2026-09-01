import { motion } from "framer-motion";
import { Ticket, AlertCircle, Clock, CheckCircle, XCircle, Flag } from "lucide-react";

interface TicketStatsProps {
  stats: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    urgent: number;
    high: number;
  };
  isLoading?: boolean;
}

export function TicketStats({ stats, isLoading }: TicketStatsProps) {
  const statCards = [
    { title: "Total", value: stats.total, icon: Ticket, color: "blue" },
    { title: "Open", value: stats.open, icon: AlertCircle, color: "yellow" },
    { title: "In Progress", value: stats.inProgress, icon: Clock, color: "blue" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "green" },
    { title: "Closed", value: stats.closed, icon: XCircle, color: "gray" },
    { title: "Urgent", value: stats.urgent, icon: Flag, color: "red" },
    { title: "High", value: stats.high, icon: Flag, color: "orange" },
  ];

  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    gray: "bg-gray-50 text-gray-600",
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="rounded-xl p-4 bg-gray-100 animate-pulse">
            <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
      {statCards.map((stat, idx) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`rounded-xl p-4 ${colors[stat.color]}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black">{stat.value.toLocaleString()}</div>
              <div className="text-xs uppercase tracking-wide mt-1">{stat.title}</div>
            </div>
            <stat.icon size={24} className="opacity-50" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}