import {
  Heart,
  Gauge,
  Fuel,
  Users,
  MapPin,
  Zap,
  Shield,
  Star,
} from "lucide-react";

import { motion } from "framer-motion";

interface FleetCardProps {
  car: any;
  onBook: (id: number) => void;
}

export default function FleetCard({
  car,
  onBook,
}: FleetCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.01,
      }}
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-gradient-to-br
      from-zinc-900
      via-black
      to-zinc-950
      shadow-2xl
      transition-all
      duration-300
      hover:border-red-500/50
    "
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* IMAGE */}

        <div className="relative group">
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            className="
              h-[320px]
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />

          <div
            className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-transparent
            to-transparent
          "
          />

          <div className="absolute top-4 left-4 flex gap-2">
            <span
              className="
              rounded-full
              bg-red-500
              px-3
              py-1
              text-xs
              font-bold
              text-white
            "
            >
              {car.av_group || "CDAV"}
            </span>

            <span
              className="
              rounded-full
              bg-emerald-500
              px-3
              py-1
              text-xs
              font-bold
              text-white
            "
            >
              Available
            </span>
          </div>

          <button
            className="
            absolute
            right-4
            top-4
            rounded-full
            bg-black/60
            p-3
            backdrop-blur
          "
          >
            <Heart size={18} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="flex flex-col justify-between p-8">
          <div>
            <div className="flex items-center gap-2">
              <Star
                className="text-yellow-400"
                size={18}
              />

              <span className="text-sm text-zinc-400">
                Premium Mauritius Fleet
              </span>
            </div>

            <h2
              className="
              mt-2
              text-4xl
              font-black
              text-white
            "
            >
              {car.make} {car.model}
            </h2>

            <p className="mt-2 text-zinc-400">
              {car.engine || "Luxury Vehicle"}
            </p>

            {/* SPECS */}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-zinc-300">
                <Users size={18} />
                {car.seats} Seats
              </div>

              <div className="flex items-center gap-2 text-zinc-300">
                <Fuel size={18} />
                {car.fuel_type}
              </div>

              <div className="flex items-center gap-2 text-zinc-300">
                <Gauge size={18} />
                {car.horsepower}
              </div>

              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin size={18} />
                {car.location}
              </div>
            </div>

            {/* FEATURES */}

            <div className="mt-6 flex flex-wrap gap-2">
              {(car.features_json || []).map(
                (feature: string) => (
                  <span
                    key={feature}
                    className="
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    px-3
                    py-1
                    text-xs
                    text-zinc-300
                  "
                  >
                    {feature}
                  </span>
                )
              )}
            </div>

            {/* TOURISM AI */}

            <div
              className="
              mt-6
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/10
              p-4
            "
            >
              <div className="flex items-center gap-2">
                <Zap
                  className="text-emerald-400"
                  size={18}
                />

                <span className="font-bold text-white">
                  Smart Recommendation
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-300">
                Ideal for Mauritius coastal roads,
                airport transfers, tourism exploration,
                and premium business travel.
              </p>
            </div>
          </div>

          {/* FOOTER */}

          <div
            className="
            mt-8
            flex
            items-center
            justify-between
          "
          >
            <div>
              <p className="text-sm text-zinc-400">
                Per Day
              </p>

              <h3
                className="
                text-5xl
                font-black
                text-red-500
              "
              >
                €{car.daily_price}
              </h3>
            </div>

            <div className="flex gap-3">
              <button
                className="
                rounded-2xl
                border
                border-white/10
                px-6
                py-4
                font-bold
                text-white
                transition-all
                hover:bg-white/10
              "
              >
                360 View
              </button>

              <button
                onClick={() => onBook(car.id)}
                className="
                rounded-2xl
                bg-red-500
                px-8
                py-4
                font-bold
                text-white
                transition-all
                hover:bg-red-600
              "
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}