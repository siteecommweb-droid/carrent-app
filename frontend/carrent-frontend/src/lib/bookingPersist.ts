export function saveBooking(data: any) {
  localStorage.setItem("am38_booking", JSON.stringify(data));
}

export function loadBooking() {
  try {
    const raw = localStorage.getItem("am38_booking");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}




