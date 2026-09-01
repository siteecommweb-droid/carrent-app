export async function updateBooking(id: number, payload: any) {
  return fetch(`http://localhost:4000/api/admin/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
}

export async function updatePayment(id: number, payload: any) {
  return fetch(`http://localhost:4000/api/admin/bookings/${id}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(res => res.json());
}

export async function exportBookings() {
  window.open("http://localhost:4000/api/admin/exports/bookings.csv");
}




