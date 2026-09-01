import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS, VEHICLE_STATUS_COLORS, VEHICLE_STATUS_LABELS } from "@/constants/calendar.constants";

export function AvailabilityLegend() {
  const eventTypes = Object.entries(EVENT_TYPE_LABELS);
  const vehicleStatuses = Object.entries(VEHICLE_STATUS_LABELS);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Calendar Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Event Types</p>
          <div className="space-y-1">
            {eventTypes.map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EVENT_TYPE_COLORS[key as keyof typeof EVENT_TYPE_COLORS] }} />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Vehicle Status</p>
          <div className="space-y-1">
            {vehicleStatuses.map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: VEHICLE_STATUS_COLORS[key as keyof typeof VEHICLE_STATUS_COLORS] }} />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}