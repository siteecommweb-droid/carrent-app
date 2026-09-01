import { useState, useEffect, useMemo } from "react";

import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  MapPin,
  RefreshCw,
  AlertCircle,
  CloudSnow,
  CloudFog,
  CloudLightning,
  ShieldAlert,
  Navigation,
  Fuel,
  Plane,
  Waves,
  Car,
  TimerReset,
  Sparkles,
  Zap,
  Activity,
  Umbrella,
  Mountain,
  Route,
} from "lucide-react";

import { motion } from "framer-motion";

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
  uvIndex?: number;
  precipitation?: number;
}

const smartLocations = [
  "Le Morne",
  "Chamarel",
  "Grand Baie",
  "SSR Airport",
  "Flic-en-Flac",
];

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const [activeLocation, setActiveLocation] =
    useState("Mauritius");

  const fetchWeather = async () => {
    setRefreshing(true);

    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-20.3484&longitude=57.5522&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation&daily=uv_index_max&timezone=Indian/Mauritius"
      );

      const data = await res.json();

      if (data.current_weather) {
        setWeather({
          temp: Math.round(
            data.current_weather.temperature
          ),

          feelsLike: Math.round(
            data.current_weather.temperature + 1
          ),

          humidity:
            data.hourly?.relativehumidity_2m?.[0] || 65,

          windSpeed: Math.round(
            data.current_weather.windspeed
          ),

          description:
            data.current_weather.weathercode === 0
              ? "Clear sky"
              : data.current_weather.weathercode <= 3
              ? "Partly cloudy"
              : data.current_weather.weathercode <= 49
              ? "Foggy"
              : data.current_weather.weathercode <= 59
              ? "Drizzle"
              : data.current_weather.weathercode <= 69
              ? "Rain"
              : data.current_weather.weathercode <= 79
              ? "Snow"
              : "Thunderstorm",

          icon:
            data.current_weather.weathercode === 0
              ? "01d"
              : data.current_weather.weathercode <= 3
              ? "02d"
              : data.current_weather.weathercode <= 49
              ? "50d"
              : data.current_weather.weathercode <= 69
              ? "10d"
              : "11d",

          location: activeLocation,

          uvIndex:
            data.daily?.uv_index_max?.[0] || 5,

          precipitation:
            data.hourly?.precipitation?.[0] || 0,
        });

        setLastUpdated(new Date());

        setError(null);
      }
    } catch (err) {
      console.error(err);

      setError("Unable to load weather intelligence.");
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    const interval = setInterval(
      fetchWeather,
      1000 * 60 * 30
    );

    return () => clearInterval(interval);
  }, [activeLocation]);

  const getIcon = () => {
    if (!weather)
      return (
        <Sun className="w-12 h-12 text-yellow-300" />
      );

    if (weather.icon.includes("01"))
      return (
        <Sun className="w-12 h-12 text-yellow-300" />
      );

    if (
      weather.icon.includes("02") ||
      weather.icon.includes("03")
    )
      return (
        <Cloud className="w-12 h-12 text-slate-200" />
      );

    if (
      weather.icon.includes("09") ||
      weather.icon.includes("10")
    )
      return (
        <CloudRain className="w-12 h-12 text-blue-300" />
      );

    if (weather.icon.includes("13"))
      return (
        <CloudSnow className="w-12 h-12 text-white" />
      );

    if (weather.icon.includes("50"))
      return (
        <CloudFog className="w-12 h-12 text-slate-300" />
      );

    if (weather.icon.includes("11"))
      return (
        <CloudLightning className="w-12 h-12 text-yellow-400" />
      );

    return (
      <Sun className="w-12 h-12 text-yellow-300" />
    );
  };

  const smartAdvice = useMemo(() => {
    if (!weather)
      return "Perfect island conditions.";

    if (weather.windSpeed > 35)
      return "⚠️ Strong coastal winds detected. Drive carefully near bridges and mountain roads.";

    if (
      weather.precipitation &&
      weather.precipitation > 5
    )
      return "🌧️ Rain expected. Reduce speed and activate headlights.";

    if (
      weather.uvIndex &&
      weather.uvIndex > 8
    )
      return "☀️ Extreme UV today. Use sunscreen and hydrate regularly.";

    if (weather.temp > 31)
      return "🔥 Hot tropical conditions. Keep water and AC ready.";

    return "🚗 Excellent weather for exploring Mauritius today.";
  }, [weather]);

  if (loading) {
    return (
      <div className="rounded-[32px] bg-gradient-to-br from-sky-600 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="flex h-48 items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
          >
            <RefreshCw className="h-10 w-10" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[32px] bg-gradient-to-br from-slate-700 to-slate-900 p-8 text-center text-white shadow-2xl">
        <AlertCircle
          className="mx-auto mb-3"
          size={36}
        />

        <div className="font-bold">
          Weather Intelligence Offline
        </div>

        <p className="mt-2 text-sm text-white/70">
          {error}
        </p>

        <button
          onClick={fetchWeather}
          className="mt-5 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1f47] via-[#1a295a] to-[#5c0f1c] p-6 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-[-20%] right-[-10%] h-[240px] w-[240px] rounded-full bg-blue-400/20 blur-3xl" />

      <div className="absolute bottom-[-20%] left-[-10%] h-[240px] w-[240px] rounded-full bg-red-400/20 blur-3xl" />

      {/* HEADER */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-4 w-4" />

            {weather.location}
          </div>

          <div className="mt-3 flex items-end gap-4">
            <div className="text-6xl font-black">
              {weather.temp}°
            </div>

            <div className="pb-2">
              <div className="text-lg capitalize">
                {weather.description}
              </div>

              <div className="text-sm text-white/60">
                Feels like {weather.feelsLike}°C
              </div>
            </div>
          </div>
        </div>

        <motion.div
          animate={{
            rotate: [0, 6, -6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
          }}
        >
          {getIcon()}
        </motion.div>
      </div>

      {/* SMART ADVICE */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative z-10 mt-6 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5 backdrop-blur-xl"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-6 w-6 text-yellow-300" />

          <div>
            <div className="font-black">
              AI Driving Intelligence
            </div>

            <div className="mt-1 text-sm text-white/80">
              {smartAdvice}
            </div>
          </div>
        </div>
      </motion.div>

      {/* METRICS */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <Thermometer className="h-5 w-5 text-orange-300" />

          <div className="mt-3 text-sm text-white/60">
            Temperature
          </div>

          <div className="mt-1 text-2xl font-black">
            {weather.temp}°C
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <Wind className="h-5 w-5 text-cyan-300" />

          <div className="mt-3 text-sm text-white/60">
            Wind Speed
          </div>

          <div className="mt-1 text-2xl font-black">
            {weather.windSpeed}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <Droplets className="h-5 w-5 text-blue-300" />

          <div className="mt-3 text-sm text-white/60">
            Humidity
          </div>

          <div className="mt-1 text-2xl font-black">
            {weather.humidity}%
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <ShieldAlert className="h-5 w-5 text-yellow-300" />

          <div className="mt-3 text-sm text-white/60">
            UV Index
          </div>

          <div className="mt-1 text-2xl font-black">
            {weather.uvIndex || 5}
          </div>
        </div>
      </div>

      {/* SMART TOURISM */}
      <div className="relative z-10 mt-6 rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Route className="h-5 w-5 text-emerald-300" />

          <div className="font-black">
            Smart Mauritius Route Advice
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Mountain className="h-4 w-4 text-orange-300" />

              Scenic Route
            </div>

            <div className="mt-2 text-sm text-white/70">
              Chamarel & Le Morne roads ideal today.
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Waves className="h-4 w-4 text-cyan-300" />

              Beach Conditions
            </div>

            <div className="mt-2 text-sm text-white/70">
              Calm ocean conditions for west coast.
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Fuel className="h-4 w-4 text-emerald-300" />

              Fuel Availability
            </div>

            <div className="mt-2 text-sm text-white/70">
              Fuel stations operating normally.
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Plane className="h-4 w-4 text-sky-300" />

              Airport Traffic
            </div>

            <div className="mt-2 text-sm text-white/70">
              Moderate airport arrival traffic.
            </div>
          </div>
        </div>
      </div>

      {/* LOCATION CHIPS */}
      <div className="relative z-10 mt-6 flex flex-wrap gap-3">
        {smartLocations.map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocation(loc)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              activeLocation === loc
                ? "bg-white text-black"
                : "bg-white/10 text-white"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-green-300" />

          LIVE weather intelligence
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchWeather}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-white backdrop-blur-xl"
          >
            <RefreshCw
              size={14}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

          {lastUpdated && (
            <div className="flex items-center gap-2">
              <TimerReset className="h-4 w-4" />

              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;