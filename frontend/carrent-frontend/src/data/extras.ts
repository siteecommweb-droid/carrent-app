import type { ExtraDefinition } from "@/types/booking";

export const extrasCatalog: ExtraDefinition[] = [
  {
    id: "glass-cover",
    name: "Tyre and Glass Cover",
    price: 130,
    mode: "per-day",
    description:
      "Extra protection for tyre and windscreen incidents during the rental.",
    icon: "ShieldCheck",
  },
  {
    id: "additional-driver",
    name: "Additional Driver",
    price: 500,
    mode: "per-rental",
    description:
      "Add one more insured driver for more flexibility across the island.",
    icon: "ShieldCheck",
  },
  {
    id: "baby-seat",
    name: "Baby Seat",
    price: 150,
    mode: "per-rental",
    description: "Secure infant seating prepared before pickup or delivery.",
    icon: "Baby",
  },
  {
    id: "booster-seat",
    name: "Booster Seat",
    price: 200,
    mode: "per-rental",
    description: "Comfortable booster support for young passengers.",
    icon: "Baby",
  },
  {
    id: "gps",
    name: "GPS / Route Help",
    price: 175,
    mode: "per-rental",
    description:
      "Navigation support for easy hotel, beach, and airport routes.",
    icon: "MapPinned",
  },
  {
    id: "roadside",
    name: "Emergency Assistance",
    price: 300,
    mode: "per-rental",
    description: "Priority roadside coordination for added peace of mind.",
    icon: "HeartHandshake",
  },
];







