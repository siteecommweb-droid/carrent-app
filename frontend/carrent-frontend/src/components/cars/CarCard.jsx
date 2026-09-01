import { Heart } from "lucide-react";

export default function CarCard({ car }) {
  const urgency = (Number(car.id?.toString().replace(/\D/g, "")) % 3) + 1;
  const viewers = (Number(car.id?.toString().replace(/\D/g, "")) % 6) + 3;
  const discount = Math.round(car.price * 0.3);

  return (
    <div className="bg-white rounded-3xl shadow p-6 flex gap-6 relative hover:shadow-2xl transition">

      <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
        <Heart size={18} />
      </button>

      <img
        src={car.image}
        className="w-52 h-36 object-cover rounded-xl"
      />

      <div className="flex-1">

        <h3 className="font-black text-xl">{car.name}</h3>

        <p className="text-green-600 text-sm font-bold mt-1">
          Only {urgency} left • {viewers} viewing now
        </p>

        <div className="flex gap-4 text-sm mt-3 text-gray-600 flex-wrap">
          <span>{car.seats} seats</span>
          <span>{car.transmission}</span>
          <span>{car.fuel}</span>
          <span>{car.luggage} bags</span>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          {car.fuelPolicy} • {car.mileage} • Free cancellation
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {car.supplier} • ⭐ {car.rating}
        </div>

      </div>

      <div className="text-right flex flex-col justify-between">

        <div>
          <p className="text-sm line-through text-gray-400">
            €{Math.round(car.price * 1.3)}
          </p>

          <p className="text-4xl font-black text-red-600">
            €{car.price}
          </p>

          <p className="text-xs text-green-600">
            Save €{discount}
          </p>
        </div>

        <div className="space-y-2 mt-4">

          <button className="bg-red-600 text-white px-5 py-3 rounded-xl w-full">
            Book now
          </button>

          <a
            href={`https://wa.me/230XXXXXXXX`}
            target="_blank"
            className="bg-green-500 text-white px-5 py-3 rounded-xl w-full block text-center"
          >
            WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}

