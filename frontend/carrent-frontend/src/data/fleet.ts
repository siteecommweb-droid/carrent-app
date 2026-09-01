// THE OFFICIAL AM38 FLEET — exactly the cars from the handwritten fleet page.
export type FleetCategory =
  | "Compact / City Cars"
  | "Standard Cars"
  | "Intermediate Cars"
  | "Premier SUV"
  | "Elite 7 Seater"
  | "Station Wagon";

export const FLEET_CATEGORIES: FleetCategory[] = [
  "Compact / City Cars",
  "Standard Cars",
  "Intermediate Cars",
  "Premier SUV",
  "Elite 7 Seater",
  "Station Wagon",
];

// The 6 guaranteed inclusions from the notes — shown under EVERY car
export const GUARANTEED_FEATURES = [
  "🤝 Meet & Greet Service",
  "⚡ Instant Booking",
  "♾ Unlimited Mileage",
  "💳 Low / Average Deposit",
  "🚐 Free Shuttle to & from Airport",
  "⛽ Fuel Policy: Same to Same",
];

export type FleetCar = {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: FleetCategory;
  av_group: string;
  price_mur: number;
  image: string;
  transmission: string;
  fuel_type: string;
  hybrid: "none" | "hybrid" | "mild-hybrid";
  seats: number;
  doors: number;
  luggage: number;
  rating: number;
  review_count: number;
  model_guaranteed: boolean; // admin can toggle per car
  is_popular: boolean;
};

export const AM38_FLEET: FleetCar[] = [
  // ===== COMPACT / CITY =====
  { id: 101, brand: "Suzuki", model: "Swift", year: 2024, category: "Compact / City Cars", av_group: "EDAV", price_mur: 1500, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 5, doors: 5, luggage: 1, rating: 4.9, review_count: 203, model_guaranteed: true, is_popular: true },
  { id: 102, brand: "Toyota", model: "Yaris", year: 2024, category: "Compact / City Cars", av_group: "CDAR", price_mur: 1800, image: "/cars/yaris.jpg", transmission: "Automatic", fuel_type: "Hybrid", hybrid: "hybrid", seats: 5, doors: 5, luggage: 2, rating: 4.8, review_count: 156, model_guaranteed: true, is_popular: true },
  { id: 103, brand: "Hyundai", model: "Grand i10", year: 2024, category: "Compact / City Cars", av_group: "CDAV", price_mur: 1250, image: "/cars/grand-i10.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 5, doors: 5, luggage: 1, rating: 4.7, review_count: 98, model_guaranteed: true, is_popular: false },
  { id: 104, brand: "Toyota", model: "Agya", year: 2024, category: "Compact / City Cars", av_group: "CDAV", price_mur: 1100, image: "/cars/agya.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 5, doors: 5, luggage: 1, rating: 4.6, review_count: 74, model_guaranteed: true, is_popular: false },
  // ===== STANDARD =====
  { id: 201, brand: "Toyota", model: "Vitz", year: 2024, category: "Standard Cars", av_group: "CDAV", price_mur: 1200, image: "/cars/vitz.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 5, doors: 5, luggage: 1, rating: 4.8, review_count: 128, model_guaranteed: true, is_popular: true },
  { id: 202, brand: "Suzuki", model: "Swift", year: 2024, category: "Standard Cars", av_group: "EDAV", price_mur: 1550, image: "/cars/swift.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 5, doors: 5, luggage: 1, rating: 4.8, review_count: 167, model_guaranteed: true, is_popular: false },
  { id: 203, brand: "Nissan", model: "Micra", year: 2024, category: "Standard Cars", av_group: "CDAV", price_mur: 1300, image: "/cars/micra.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 5, doors: 5, luggage: 1, rating: 4.6, review_count: 81, model_guaranteed: true, is_popular: false },
  // ===== INTERMEDIATE =====
  { id: 301, brand: "Toyota", model: "Aqua", year: 2024, category: "Intermediate Cars", av_group: "HDAV", price_mur: 1700, image: "/cars/aqua.jpg", transmission: "Automatic", fuel_type: "Hybrid", hybrid: "hybrid", seats: 5, doors: 5, luggage: 2, rating: 4.9, review_count: 245, model_guaranteed: true, is_popular: true },
  { id: 302, brand: "Hyundai", model: "i20", year: 2024, category: "Intermediate Cars", av_group: "CDAR", price_mur: 1600, image: "/cars/i20.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 5, doors: 5, luggage: 2, rating: 4.7, review_count: 112, model_guaranteed: true, is_popular: false },
  // ===== PREMIER SUV =====
  { id: 401, brand: "Suzuki", model: "Fronx", year: 2024, category: "Premier SUV", av_group: "IFAR", price_mur: 2200, image: "/cars/fronx.jpg", transmission: "Automatic", fuel_type: "Mild Hybrid", hybrid: "mild-hybrid", seats: 5, doors: 5, luggage: 3, rating: 4.8, review_count: 134, model_guaranteed: true, is_popular: true },
  { id: 402, brand: "Suzuki", model: "Grand Vitara", year: 2024, category: "Premier SUV", av_group: "SFAR", price_mur: 2600, image: "/cars/vitara.jpg", transmission: "Automatic", fuel_type: "Mild Hybrid", hybrid: "mild-hybrid", seats: 5, doors: 5, luggage: 3, rating: 4.9, review_count: 234, model_guaranteed: true, is_popular: true },
  // ===== ELITE 7 SEATER =====
  { id: 501, brand: "Suzuki", model: "Ertiga", year: 2024, category: "Elite 7 Seater", av_group: "MVAR", price_mur: 3000, image: "/cars/ertiga.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 7, doors: 5, luggage: 3, rating: 4.8, review_count: 189, model_guaranteed: true, is_popular: true },
  { id: 502, brand: "Toyota", model: "Rush", year: 2024, category: "Elite 7 Seater", av_group: "MVAR", price_mur: 3200, image: "/cars/rush.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 7, doors: 5, luggage: 3, rating: 4.7, review_count: 96, model_guaranteed: true, is_popular: false },
  { id: 503, brand: "Suzuki", model: "XL7", year: 2024, category: "Elite 7 Seater", av_group: "MVAR", price_mur: 3100, image: "/cars/xl7.jpg", transmission: "Automatic", fuel_type: "Petrol", hybrid: "none", seats: 7, doors: 5, luggage: 3, rating: 4.7, review_count: 88, model_guaranteed: true, is_popular: false },
  // ===== STATION WAGON =====
  { id: 601, brand: "Honda", model: "Shuttle", year: 2024, category: "Station Wagon", av_group: "SWAR", price_mur: 2400, image: "/cars/shuttle.jpg", transmission: "Automatic", fuel_type: "Hybrid", hybrid: "hybrid", seats: 5, doors: 5, luggage: 3, rating: 4.7, review_count: 102, model_guaranteed: true, is_popular: false },
];

// Missing photos fall back safely until you add the real .jpg files:
export const IMAGE_FALLBACK: Record<string, string> = {
  "/cars/grand-i10.jpg": "/cars/vitz.jpg",
  "/cars/agya.jpg": "/cars/vitz.jpg",
  "/cars/micra.jpg": "/cars/magnite.jpg",
  "/cars/i20.jpg": "/cars/swift.jpg",
  "/cars/fronx.jpg": "/cars/vitara.jpg",
  "/cars/rush.jpg": "/cars/vitara.jpg",
  "/cars/xl7.jpg": "/cars/ertiga.jpg",
};
export function fleetImage(src: string) {
  return src; // used with onError fallback in the page
}