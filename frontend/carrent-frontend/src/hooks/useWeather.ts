import { useState, useEffect } from "react";
import { fetchWeather, fetchWeatherForecast } from "../services/api";

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
  forecast?: { date: string; temp: number; description: string }[];
}

export function useWeather(lat: number = -20.3484, lon: number = 57.5522) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        const [current, forecast] = await Promise.all([
          fetchWeather(lat, lon),
          fetchWeatherForecast(lat, lon)
        ]);
        
        const dailyForecast = forecast.list.filter((_: any, i: number) => i % 8 === 0).slice(0, 5).map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString(),
          temp: Math.round(item.main.temp),
          description: item.weather[0].description
        }));
        
        setWeather({
          temp: Math.round(current.main.temp),
          feelsLike: Math.round(current.main.feels_like),
          humidity: current.main.humidity,
          windSpeed: current.wind.speed,
          description: current.weather[0].description,
          icon: current.weather[0].icon,
          location: current.name,
          forecast: dailyForecast
        });
        setError(null);
      } catch (err) {
        setError("Failed to load weather data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, [lat, lon]);

  return { weather, loading, error };
}





