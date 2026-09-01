import CarCard from "./CarCard";

export default {
  title: "UI/CarCard",
  component: CarCard,
};

export const Default = () => (
  <CarCard
    car={{
      make: "Suzuki",
      model: "Swift",
      seats: 5,
      transmission: "Automatic",
      daily_price: 1800,
      image: "swift.jpg",
    }}
    onBook={() => {}}
    onDetails={() => {}}
  />
);




