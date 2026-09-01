import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, LayoutGrid, List, Plus } from "lucide-react";

interface CalendarToolbarProps {
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onViewChange: (view: string) => void;
  currentView: string;
  onAddEvent?: () => void;
  label: string;
}

export function CalendarToolbar({ onNavigate, onViewChange, currentView, onAddEvent, label }: CalendarToolbarProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("PREV")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate("NEXT")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="ml-4 text-lg font-semibold">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange("month")}
            className={`px-3 py-1.5 text-sm transition ${
              currentView === "month" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CalendarDays className="h-4 w-4 inline mr-1" /> Month
          </button>
          <button
            onClick={() => onViewChange("week")}
            className={`px-3 py-1.5 text-sm transition ${
              currentView === "week" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutGrid className="h-4 w-4 inline mr-1" /> Week
          </button>
          <button
            onClick={() => onViewChange("day")}
            className={`px-3 py-1.5 text-sm transition ${
              currentView === "day" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <List className="h-4 w-4 inline mr-1" /> Day
          </button>
        </div>
        {onAddEvent && (
          <Button onClick={onAddEvent} size="sm" className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-1" /> Add Event
          </Button>
        )}
      </div>
    </div>
  );
}