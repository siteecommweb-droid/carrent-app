export async function trackTripExport(data: any) {
  await fetch("http://localhost:4000/api/trip-exports/track-export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}