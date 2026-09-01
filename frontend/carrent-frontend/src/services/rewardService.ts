import { fetchAPI } from "@/lib/api";
export interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  icon: string;
}

export interface UserReward {
  userId: number;
  totalPoints: number;
  history: { date: string; points: number; action: string }[];
  redeemedRewards: { rewardId: number; date: string }[];
}

// Stockage local des points (backend requis pour persistance)
const REWARDS_KEY = "am38_user_rewards";

export function getLocalRewards(): UserReward | null {
  const stored = localStorage.getItem(REWARDS_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export function saveLocalRewards(rewards: UserReward) {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}

export function addPoints(action: string, points: number): UserReward | null {
  const current = getLocalRewards();
  if (!current) return null;

  const updated = {
    ...current,
    totalPoints: current.totalPoints + points,
    history: [
      { date: new Date().toISOString(), points, action },
      ...current.history,
    ],
  };
  saveLocalRewards(updated);
  return updated;
}

export function redeemReward(rewardId: number, pointsCost: number): boolean {
  const current = getLocalRewards();
  if (!current || current.totalPoints < pointsCost) return false;

  const updated = {
    ...current,
    totalPoints: current.totalPoints - pointsCost,
    redeemedRewards: [
      ...current.redeemedRewards,
      { rewardId, date: new Date().toISOString() },
    ],
  };
  saveLocalRewards(updated);
  return true;
}

export const availableRewards: Reward[] = [
  {
    id: 1,
    name: "Free Upgrade",
    points: 500,
    description: "Upgrade to next car category",
    icon: "🚗",
  },
  {
    id: 2,
    name: "Discount 10%",
    points: 1000,
    description: "10% off next booking",
    icon: "💰",
  },
  {
    id: 3,
    name: "Free Airport Pickup",
    points: 750,
    description: "Free delivery to airport",
    icon: "✈️",
  },
  {
    id: 4,
    name: "Premium Support",
    points: 300,
    description: "Priority WhatsApp support",
    icon: "⭐",
  },
  {
    id: 5,
    name: "Free Extra Driver",
    points: 400,
    description: "Add second driver free",
    icon: "👥",
  },
];

export const actionsPoints = {
  share_trip: 50,
  upload_photo: 100,
  write_review: 150,
  book_car: 200,
  refer_friend: 300,
  complete_trip: 100,
};







