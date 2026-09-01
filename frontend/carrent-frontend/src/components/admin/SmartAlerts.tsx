import { AlertTriangle } from "lucide-react";

export default function SmartAlerts({ bookings }: { bookings: any[] }) {
  const now = new Date();

  const overdue = bookings.filter((b) => {
    const end = new Date(b.end_date || b.end_datetime);
    return end < now && b.status === "confirmed";
  });

  if (!overdue.length) return null;

  return (
    <div className="rounded-2xl border bg-red-50 p-4 text-red-800">
      <div className="flex items-center gap-2 font-bold">
        <AlertTriangle className="h-5 w-5" />
        Overdue Vehicles ({overdue.length})
      </div>

      <div className="text-sm mt-2">
        Some vehicles are not returned on time.
      </div>
    </div>
  );
}








