export type Addon = {
  id: string;
  name: string;
  price: number;
};

export const ADDONS: Addon[] = [
  {
    id: "gps",
    name: "GPS Navigation",
    price: 200,
  },
  {
    id: "child_seat",
    name: "Child Seat",
    price: 300,
  },
  {
    id: "additional_driver",
    name: "Additional Driver",
    price: 500,
  },
  {
    id: "insurance_plus",
    name: "Full Insurance",
    price: 800,
  },
];




