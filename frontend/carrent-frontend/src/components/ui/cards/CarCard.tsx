import {
  CarFront,
  Sparkles,
  Fuel,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function CarCard({
  car,
  onBook,
  onDetails,
}: {
  car: any;
  onBook: () => void;
  onDetails: () => void;
}) {
  const image = `/cars/${
    car.image || "swift.jpg"
  }`;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={`${car.make} ${car.model}`}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {Number(car.is_featured) === 1 && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black shadow">
            <Sparkles className="h-3 w-3" />
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xl font-black text-slate-900">
          <CarFront className="h-5 w-5" />
          {car.make} {car.model}
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-black/70">
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            {car.transmission}
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {car.seats} seats
          </div>
        </div>

        <div className="mt-5 text-3xl font-black text-slate-900">
          MUR{" "}
          {Number(
            car.daily_price || 0
          ).toLocaleString()}
          <span className="ml-1 text-sm font-medium text-slate-500">
            /day
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDetails}
          >
            Details
          </Button>

          <Button
            className="flex-1"
            onClick={onBook}
          >
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}