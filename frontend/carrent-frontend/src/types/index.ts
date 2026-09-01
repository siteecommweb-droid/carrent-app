export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  image: string;
  model3d?: string;
  specs: {
    horsepower: number;
    acceleration: number;
    topSpeed: number;
    fuelType: string;
    seats: number;
    transmission: string;
  };
  features: string[];
  available: boolean;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  walletBalance: number;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentId?: string;
}
