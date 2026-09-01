export default function LoyaltyPointsWidget({ points }: { points: number }) {
  return (
    <div className="border rounded-xl p-4 bg-yellow-50">
      <div className="font-semibold">Loyalty Points</div>
      <div className="text-xl font-bold">{points}</div>
    </div>
  );
}








