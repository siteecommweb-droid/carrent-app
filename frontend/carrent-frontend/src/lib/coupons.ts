export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
};

export const COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    type: "percent",
    value: 10,
  },
  {
    code: "RAMADAN15",
    type: "percent",
    value: 15,
  },
  {
    code: "AIRPORT5",
    type: "fixed",
    value: 500,
  },
];

export function applyCoupon(total: number, code: string) {
  const c = COUPONS.find(
    (x) => x.code.toLowerCase() === code.toLowerCase()
  );

  if (!c) return 0;

  if (c.type === "percent") {
    return Math.round(total * (c.value / 100));
  }

  return c.value;
}




