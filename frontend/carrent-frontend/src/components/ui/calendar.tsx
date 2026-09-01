import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  highlightedDates?: Date[];
  blockedDates?: Date[];
  maintenanceDates?: Date[];
  bookedDates?: Date[];
  availabilityMap?: Record<string, "available" | "booked" | "maintenance" | "blocked">;
  onDateSelect?: (date: Date) => void;
};

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  highlightedDates = [],
  blockedDates = [],
  maintenanceDates = [],
  bookedDates = [],
  availabilityMap = {},
  onDateSelect,
  ...props
}: CalendarProps) {
  const modifiers = React.useMemo(() => {
    const mods: Record<string, Date[]> = {
      highlighted: highlightedDates,
      blocked: blockedDates,
      maintenance: maintenanceDates,
      booked: bookedDates,
    };
    return mods;
  }, [highlightedDates, blockedDates, maintenanceDates, bookedDates]);

  const modifiersStyles = React.useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {
      highlighted: {
        backgroundColor: "#fef3c7",
        color: "#b45309",
        borderRadius: "9999px",
        fontWeight: "bold",
        border: "1px solid #f59e0b",
      },
      blocked: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        borderRadius: "9999px",
        textDecoration: "line-through",
        cursor: "not-allowed",
        opacity: 0.6,
      },
      maintenance: {
        backgroundColor: "#fef9c3",
        color: "#ca8a04",
        borderRadius: "9999px",
        border: "1px dashed #eab308",
      },
      booked: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        borderRadius: "9999px",
        fontWeight: "600",
      },
    };
    return styles;
  }, []);

  const handleDayClick = (date: Date) => {
    const dateKey = getDateKey(date);
    const availability = availabilityMap[dateKey];
    if (availability === "blocked") return;
    if (onDateSelect) onDateSelect(date);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      onDayClick={handleDayClick}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-all duration-200 hover:scale-105"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground font-bold ring-1 ring-primary",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
  PreviousMonthButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>
      <ChevronLeft className="h-4 w-4" />
    </button>
  ),
  NextMonthButton: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>
      <ChevronRight className="h-4 w-4" />
    </button>
  ),
}}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };