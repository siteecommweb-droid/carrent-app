import CarCard from "./CarCard";

export default function CarsGrid({ cars = [] }) {
  if (!cars.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white">No cars found</h3>
        <p className="mt-2 text-sm text-white/60">
          Try changing the filter or search dates.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cars.map((car) => <CarCard key={car.id} car={car} />)}
    </div>
  );
}

