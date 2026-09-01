export default function PriceBreakdown({
  base,
  addons,
  discount,
}: {
  base: number;
  addons: number;
  discount: number;
}) {
  const total = base + addons - discount;

  return (
    <div className="border rounded-xl p-4 space-y-2">
      <div className="flex justify-between">
        <span>Rental</span>
        <span>{base}</span>
      </div>

      <div className="flex justify-between">
        <span>Addons</span>
        <span>{addons}</span>
      </div>

      <div className="flex justify-between text-red-500">
        <span>Discount</span>
        <span>- {discount}</span>
      </div>

      <hr />

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  );
}








