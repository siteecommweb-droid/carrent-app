import { fetchAPI } from "@/lib/api";
import { CalendarEvent, CalendarFilterParams, CalendarStats, Vehicle, Driver } from "@/types/calendar.types";

const BASE_URL = "/admin/calendar";

export const calendarApi = {
  async getEvents(params?: CalendarFilterParams): Promise<CalendarEvent[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.type && params.type !== "all") queryParams.append("type", params.type);
    if (params?.status && params.status !== "all") queryParams.append("status", params.status);
    if (params?.carId && params.carId !== "all") queryParams.append("carId", params.carId.toString());
    if (params?.driverId && params.driverId !== "all") queryParams.append("driverId", params.driverId.toString());
    
    const url = queryParams.toString() ? `${BASE_URL}/events?${queryParams}` : `${BASE_URL}/events`;
    const response = await fetchAPI(url);
    return response.data || response;
  },

  async getEvent(id: string): Promise<CalendarEvent> {
    const response = await fetchAPI(`${BASE_URL}/events/${id}`);
    return response.data || response;
  },

  async createEvent(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const response = await fetchAPI(`${BASE_URL}/events`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data || response;
  },

  async updateEvent(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const response = await fetchAPI(`${BASE_URL}/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data || response;
  },

  async deleteEvent(id: string): Promise<void> {
    await fetchAPI(`${BASE_URL}/events/${id}`, { method: "DELETE" });
  },

  async moveEvent(id: string, start: Date, end: Date): Promise<CalendarEvent> {
    const response = await fetchAPI(`${BASE_URL}/events/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() }),
    });
    return response.data || response;
  },

  async getVehicles(): Promise<Vehicle[]> {
    const response = await fetchAPI(`${BASE_URL}/vehicles`);
    return response.data || response;
  },

  async getVehicle(id: number): Promise<Vehicle> {
    const response = await fetchAPI(`${BASE_URL}/vehicles/${id}`);
    return response.data || response;
  },

  async updateVehicleStatus(id: number, status: string): Promise<Vehicle> {
    const response = await fetchAPI(`${BASE_URL}/vehicles/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return response.data || response;
  },

  async getDrivers(): Promise<Driver[]> {
    const response = await fetchAPI(`${BASE_URL}/drivers`);
    return response.data || response;
  },

  async assignDriver(eventId: string, driverId: number): Promise<CalendarEvent> {
    const response = await fetchAPI(`${BASE_URL}/events/${eventId}/assign-driver`, {
      method: "POST",
      body: JSON.stringify({ driverId }),
    });
    return response.data || response;
  },

  async getStats(): Promise<CalendarStats> {
    const response = await fetchAPI(`${BASE_URL}/stats`);
    return response.data || response;
  },

  async checkOverlap(start: Date, end: Date, carId?: number): Promise<Array<CalendarEvent>> {
    const queryParams = new URLSearchParams();
    queryParams.append("start", start.toISOString());
    queryParams.append("end", end.toISOString());
    if (carId) queryParams.append("carId", carId.toString());
    
    const response = await fetchAPI(`${BASE_URL}/check-overlap?${queryParams}`);
    return response.data || response;
  },
};