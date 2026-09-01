import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SmartSearchBar() {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [fuel, setFuel] = useState("");

  const navigate = useNavigate();

  function handleSearch() {
    const params = new URLSearchParams();

    if (location) params.set("location", location);
    if (price) params.set("maxPrice", price);
    if (seats) params.set("seats", seats);
    if (fuel) params.set("fuel", fuel);

    navigate(`/cars?${params.toString()}`);
  }

  return (
    <div className="grid md:grid-cols-5 gap-2 bg-white p-3 rounded-xl text-black">

      <input
        placeholder="Location (MRU / Mauritius)"
        value={location}
        onChange={(e) => setLocation(e.target.value)} className="px-3 py-2 border rounded"
      />

      <input
        placeholder="Max Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)} className="px-3 py-2 border rounded"
      />

      <select onChange={(e) => setSeats(e.target.value)} className="border rounded px-2">
        <option value="">Seats</option>
        <option value="2">2</option>
        <option value="5">5</option>
        <option value="7">7</option>
      </select>

      <select onChange={(e) => setFuel(e.target.value)} className="border rounded px-2">
        <option value="">Fuel</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-red-600 text-white rounded px-4"
      >
        Search
      </button>
    </div>
  );
}












