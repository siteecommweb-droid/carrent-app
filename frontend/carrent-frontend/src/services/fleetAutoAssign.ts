export function autoAssignFleet(bookings: any[], cars: any[]) {
  const assigned: any[] = [];

  function isOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && bStart < aEnd;
  }

  bookings.forEach((b) => {
    const start = new Date(b.pickupDate);
    const end = new Date(b.dropoffDate);

    let assignedCar = null;

    for (const car of cars) {
      const conflict = assigned.some(
        (x) => x.carId === car.id && isOverlap(x.start, x.end, start, end),
      );

      if (!conflict) {
        assignedCar = car;
        break;
      }
    }

    assigned.push({
      ...b,
      carAssigned: assignedCar?.name || "UNASSIGNED",
    });
  });

  return assigned;
}







