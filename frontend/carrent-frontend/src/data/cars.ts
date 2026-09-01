export type FleetStatus =
  | "available"
  | "booked"
  | "maintenance"
  | "blocked";

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;

  avGroup: string;
  fleetRow: string;
  plate: string;

  status: FleetStatus;

  branch: string;
  airportReady: boolean;
  leadTimehours: number;

  category: string;
  fuel: string;

  seats: number;
  luggage: number;
  door: number;

  transmission: string;

  price: number;
  daily_price: number;

  rating: number;

  popular: boolean;

  image: string;

  fuelPolicy: string;
  mileage: string;
  supplier: string;

  horsepower: number;
  top_speed: number;
  acceleration: number;

  year: number;
  engine: string;
  fuel_tank: number;

  safety_rating: number;

  has_gps: boolean;
  has_bluetooth: boolean;
  has_camera: boolean;
  has_cruise: boolean;
  has_keyless: boolean;
  has_usb: boolean;

  instant_booking: boolean;
  free_cancellation: boolean;
  is_popular: boolean;
}

export const cars: Car[] = [
  {
    id: "CDAV-001",

    name: "Toyota Vitz",
    brand: "Toyota",
    model: "Vitz",

    avGroup: "CDAV",
    fleetRow: "A",

    plate: "1234AB",

    status: "available",

    branch: "MRU Airport",

    airportReady: true,

    leadTimehours: 2,

    category: "Economy",

    fuel: "Petrol",

    seats: 5,

    luggage: 1,

    door: 5,

    transmission: "Automatic",

    price: 36,

    daily_price: 1800,

    rating: 4.8,

    popular: true,

    image: "/cars/vitz.jpg",

    fuelPolicy: "Full to Full",

    mileage: "Unlimited Mileage",

    supplier: "AM38 Elite Fleet",

    horsepower: 110,

    top_speed: 180,

    acceleration: 10.5,

    year: 2025,

    engine: "1.3L Dual VVT-i",

    fuel_tank: 42,

    safety_rating: 5,

    has_gps: true,
    has_bluetooth: true,
    has_camera: true,
    has_cruise: true,
    has_keyless: true,
    has_usb: true,

    instant_booking: true,
    free_cancellation: true,
    is_popular: true,
  },

  {
    id: "CDAV-002",

    name: "Hyundai Grand i10",
    brand: "Hyundai",
    model: "Grand i10",

    avGroup: "CDAV",
    fleetRow: "B",

    plate: "5678CD",

    status: "available",

    branch: "MRU Airport",

    airportReady: true,

    leadTimehours: 2,

    category: "Economy",

    fuel: "Petrol",

    seats: 5,

    luggage: 1,

    door: 5,

    transmission: "Automatic",

    price: 38,

    daily_price: 1900,

    rating: 4.7,

    popular: true,

    image: "/cars/grand-i10.jpg",

    fuelPolicy: "Full to Full",

    mileage: "Unlimited Mileage",

    supplier: "AM38 Elite Fleet",

    horsepower: 115,

    top_speed: 185,

    acceleration: 10.1,

    year: 2025,

    engine: "1.2L Kappa",

    fuel_tank: 43,

    safety_rating: 5,

    has_gps: true,
    has_bluetooth: true,
    has_camera: true,
    has_cruise: true,
    has_keyless: true,
    has_usb: true,

    instant_booking: true,
    free_cancellation: true,
    is_popular: true,
  },

  {
    id: "EDAV-001",

    name: "Suzuki Swift",
    brand: "Suzuki",
    model: "Swift",

    avGroup: "EDAV",
    fleetRow: "A",

    plate: "8888SW",

    status: "available",

    branch: "MRU Airport",

    airportReady: true,

    leadTimehours: 3,

    category: "Economy",

    fuel: "Petrol",

    seats: 5,

    luggage: 2,

    door: 5,

    transmission: "Automatic",

    price: 41,

    daily_price: 2050,

    rating: 4.9,

    popular: true,

    image: "/cars/swift.jpg",

    fuelPolicy: "Full to Full",

    mileage: "Unlimited Mileage",

    supplier: "AM38 Elite Fleet",

    horsepower: 125,

    top_speed: 195,

    acceleration: 9.2,

    year: 2025,

    engine: "1.4L BoosterJet",

    fuel_tank: 45,

    safety_rating: 5,

    has_gps: true,
    has_bluetooth: true,
    has_camera: true,
    has_cruise: true,
    has_keyless: true,
    has_usb: true,

    instant_booking: true,
    free_cancellation: true,
    is_popular: true,
  },

  {
    id: "MDAV-001",

    name: "Hyundai Venue",
    brand: "Hyundai",
    model: "Venue",

    avGroup: "MDAV",
    fleetRow: "A",

    plate: "SUV111",

    status: "available",

    branch: "MRU Airport",

    airportReady: true,

    leadTimehours: 4,

    category: "SUV",

    fuel: "Petrol",

    seats: 5,

    luggage: 2,

    door: 5,

    transmission: "Automatic",

    price: 64,

    daily_price: 3200,

    rating: 4.8,

    popular: true,

    image: "/cars/venue.jpg",

    fuelPolicy: "Full to Full",

    mileage: "Unlimited Mileage",

    supplier: "AM38 Elite Fleet",

    horsepower: 150,

    top_speed: 210,

    acceleration: 8.8,

    year: 2025,

    engine: "1.6L Turbo",

    fuel_tank: 55,

    safety_rating: 5,

    has_gps: true,
    has_bluetooth: true,
    has_camera: true,
    has_cruise: true,
    has_keyless: true,
    has_usb: true,

    instant_booking: true,
    free_cancellation: true,
    is_popular: true,
  },

  {
    id: "VDAV-001",

    name: "Suzuki Ertiga",
    brand: "Suzuki",
    model: "Ertiga",

    avGroup: "VDAV",
    fleetRow: "A",

    plate: "FAM777",

    status: "available",

    branch: "MRU Airport",

    airportReady: true,

    leadTimehours: 6,

    category: "7 Seater",

    fuel: "Petrol",

    seats: 7,

    luggage: 3,

    door: 5,

    transmission: "Automatic",

    price: 74,

    daily_price: 3700,

    rating: 4.7,

    popular: true,

    image: "/cars/ertiga.jpg",

    fuelPolicy: "Full to Full",

    mileage: "Unlimited Mileage",

    supplier: "AM38 Elite Fleet",

    horsepower: 138,

    top_speed: 190,

    acceleration: 9.7,

    year: 2025,

    engine: "1.5L Smart Hybrid",

    fuel_tank: 50,

    safety_rating: 5,

    has_gps: true,
    has_bluetooth: true,
    has_camera: true,
    has_cruise: true,
    has_keyless: true,
    has_usb: true,

    instant_booking: true,
    free_cancellation: true,
    is_popular: true,
  },
];