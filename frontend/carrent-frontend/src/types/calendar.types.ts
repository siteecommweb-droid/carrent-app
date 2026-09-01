export type CalendarEventType = "booking" | "ticket" | "maintenance" | "wash" | "repair" | "blocked" | "delivery" | "pickup" | "inspection" | "service";

export type CalendarEventStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "missed";

export type VehicleStatus = "available" | "rented" | "maintenance" | "cleaning" | "blocked" | "reserved";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: CalendarEventType;
  status: CalendarEventStatus;
  reference: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  carId?: number;
  carName?: string;
  carPlate?: string;
  driverId?: number;
  driverName?: string;
  flightNumber?: string;
  landingTime?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
  checklistCompleted?: boolean;
  fuelLevel?: number;
  mileage?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  assignedTo?: string;
}

export interface Vehicle {
  id: number;
  name: string;
  make: string;
  model: string;
  plate: string;
  status: VehicleStatus;
  location: string;
  fuelLevel: number;
  mileage: number;
  lastServiceDate?: string;
  nextServiceDate?: string;
  insuranceExpiry?: string;
  roadTaxExpiry?: string;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  isAvailable: boolean;
  assignedVehicleId?: number;
}

export interface CalendarFilterParams {
  startDate?: string;
  endDate?: string;
  type?: CalendarEventType | "all";
  status?: CalendarEventStatus | "all";
  carId?: number | "all";
  driverId?: number | "all";
}

export interface CalendarStats {
  totalBookings: number;
  totalMaintenance: number;
  totalWashes: number;
  availableCars: number;
  rentedCars: number;
  maintenanceCars: number;
  cleaningCars: number;
  blockedCars: number;
  upcomingServices: number;
  overdueServices: number;
}