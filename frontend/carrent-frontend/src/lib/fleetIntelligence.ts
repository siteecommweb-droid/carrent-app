export function calculateFleetUtilization(
  totalCars: number,
  activeBookings: number
) {
  if (!totalCars) return 0;

  return Math.round(
    (activeBookings / totalCars) * 100
  );
}

export function getFleetHealthStatus(
  utilization: number
) {
  if (utilization >= 90)
    return "critical";

  if (utilization >= 70)
    return "high";

  if (utilization >= 40)
    return "normal";

  return "low";
}