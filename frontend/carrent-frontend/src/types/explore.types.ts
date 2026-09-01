export type PlaceCategory =
  | "Beach"
  | "Nature"
  | "City"
  | "Food"
  | "Hotel"
  | "Hospital"
  | "Fuel"
  | "Culture"
  | "Family"
  | "Adventure";
export type TripMood =
  | "first time"
  | "Family"
  | "Couple"
  | "Luxury"
  | "Adventure"
  | "Budget"
  | "Local culture";

export interface SearchPlace {
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  importance?: number;
}

export interface LocalPlace {
  id: number;
  name: string;
  category: PlaceCategory;
  area: string;
  bestTime: string;
  duration: string;
  kmFromAirport: number;
  fuelLitres: number;
  mood: TripMood[];
  description: string;
  image: string;
  tags: string[];
  routeTip: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
}

export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
  lastUpdate: string;
}

export interface FuelPrice {
  petrol: number;
  diesel: number;
  lastUpdate: string;
}

export interface NewsItem {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
}

export interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  icon: string;
}

export interface UserRewards {
  totalPoints: number;
  history: { date: string; points: number; action: string }[];
  availableRewards: Reward[];
}







