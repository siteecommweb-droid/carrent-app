export async function smartSearch(query: string) {
  // Fake AI logic (replace later with real OpenAI)
  return {
    category: query.includes("family") ? "SUV" : "",
    fuel: query.includes("cheap") ? "petrol" : "",
    seats: query.includes("7") ? "7" : "",
  };
}




