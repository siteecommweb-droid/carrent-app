export function getUserLevel(points: number) {
  if (points > 1000) return "VVIP";
  if (points > 500) return "VIP";
  if (points > 200) return "PRO";
  return "STANDARD";
}

export function addPoints(current: number, amount: number) {
  return current + Math.floor(amount / 10);
}







