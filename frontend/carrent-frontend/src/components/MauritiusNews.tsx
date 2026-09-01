import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Newspaper,
  ExternalLink,
  Globe2,
  Clock3,
  AlertTriangle,
  Wifi,
} from "lucide-react";

import { fetchMauritiusNews } from "@/services/api";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const clocks = [
  {
    city: "Mauritius",
    timezone: "Indian/Mauritius",
  },
  {
    city: "London",
    timezone: "Europe/London",
  },
  {
    city: "Dubai",
    timezone: "Asia/Dubai",
  },
  {
    city: "Tokyo",
    timezone: "Asia/Tokyo",
  },
  {
    city: "New York",
    timezone: "America/New_York",
  },
];

export default function MauritiusNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [times, setTimes] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const interval = setInterval(() => {
      const next: Record<string, string> = {};

      clocks.forEach((clock) => {
        next[clock.city] =
          new Intl.DateTimeFormat("en-GB", {
            timeStyle: "medium",
            timeZone: clock.timezone,
          }).format(new Date());
      });

      setTimes(next);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);

        const data = await fetchMauritiusNews();

        setNews(data?.articles?.slice(0, 8) || []);
      } catch (err) {
        setError("Could not load live news");
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Loader />
          <span className="font-bold text-white">
            Loading live Mauritius news...
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-white/10"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-xl">
        <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-400" />

        <p className="font-bold text-red-300">
          {error}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl"
    >
      {/* HEADER */}
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-yellow-400/20 p-3 text-yellow-400">
                <Newspaper className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Mauritius & World News
                </h2>

                <p className="text-sm text-white/60">
                  Live tourism, travel, airport &
                  world updates
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-400/20 bg-green-500/10 px-4 py-2 text-xs font-bold text-green-300">
            <Wifi className="h-4 w-4" />
            LIVE FEED
          </div>
        </div>
      </div>

      {/* WORLD CLOCKS */}
      <div className="border-b border-white/10 p-5">
        <div className="mb-3 flex items-center gap-2 text-white">
          <Clock3 className="h-5 w-5 text-cyan-400" />
          <span className="font-bold">
            Global Travel Clocks
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {clocks.map((clock) => (
            <div
              key={clock.city}
              className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center"
            >
              <p className="text-xs font-bold text-white/60">
                {clock.city}
              </p>

              <p className="mt-1 text-sm font-black text-white">
                {times[clock.city] || "--:--"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* NEWS */}
      <div className="max-h-[650px] space-y-4 overflow-y-auto p-5">
        {news.map((item, i) => (
          <motion.a
            key={i}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            whileHover={{
              scale: 1.01,
            }}
            className="group block overflow-hidden rounded-3xl border border-white/10 bg-black/20 transition-all hover:border-cyan-400/30 hover:bg-white/10"
          >
            <div className="grid gap-0 md:grid-cols-[260px_1fr]">
              <div className="relative h-[220px] overflow-hidden">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  }
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                  {item.source?.name || "News"}
                </div>
              </div>

              <div className="flex flex-col justify-between p-5">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-300">
                    <Globe2 className="h-4 w-4" />
                    Live Article
                  </div>

                  <h3 className="line-clamp-2 text-xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/40">
                    {new Date(
                      item.publishedAt
                    ).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-300">
                    Read article
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}

function Loader() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
  );
}