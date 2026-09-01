import { motion } from "framer-motion";
import {
  Star,
  Quote,
  BadgeCheck,
} from "lucide-react";

import type { Testimonial } from "../lib/types";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < n
              ? "text-yellow-400"
              : "text-white/20"
          }`}
          fill={
            i < n ? "currentColor" : "none"
          }
        />
      ))}
    </div>
  );
}

export default function TestimonialsSlider({
  items,
}: {
  items: Testimonial[];
}) {
  return (
    <section className="relative overflow-hidden bg-black/[0.02] py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/5" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.3em] text-cyan-500">
              Trusted Worldwide
            </div>

            <h2 className="mt-2 text-4xl font-black text-black md:text-5xl">
              Tourists love AM38.
            </h2>

            <p className="mt-3 max-w-2xl text-black/60">
              Verified travelers from around the
              world trust AM38 for airport
              delivery, clean vehicles, smooth
              booking, and premium service.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white px-5 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-cyan-500" />

              <span className="text-sm font-bold">
                Verified Reviews
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden">
          <motion.div
            className="flex gap-5"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...items, ...items].map(
              (t, idx) => (
                <div
                  key={`${t.id}-${idx}`}
                  className="min-w-[320px] rounded-3xl border border-black/10 bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl md:min-w-[420px]"
                >
                  <div className="flex items-center justify-between">
                    <Stars n={t.rating} />

                    <Quote className="h-6 w-6 text-cyan-500/30" />
                  </div>

                  <div className="mt-5 text-[15px] leading-relaxed text-black/80">
                    “{t.text}”
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-black text-white">
                      {t.name.charAt(0)}
                    </div>

                    <div>
                      <div className="font-black text-black">
                        {t.name}
                      </div>

                      <div className="text-xs uppercase tracking-wider text-black/50">
                        {t.country}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}