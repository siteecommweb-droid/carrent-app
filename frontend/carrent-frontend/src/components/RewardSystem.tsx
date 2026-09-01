import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Gift,
  Star,
  TrendingUp,
  Sparkles,
  Zap,
  Camera,
  Share2,
  Users,
  CheckCircle,
} from "lucide-react";
import {
  getLocalRewards,
  saveLocalRewards,
  availableRewards,
  addPoints,
  actionsPoints,
} from "../services/rewardService";

// Type definitions
interface Reward {
  id: number;
  name: string;
  points: number;
  icon: string;
  description?: string;
}

interface UserRewards {
  userId: number;
  totalPoints: number;
  history: Array<{ date: string; points: number; action: string }>;
  redeemedRewards: Array<{ rewardId: number; date: string }>;
}

export default function RewardSystem() {
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentAction, setRecentAction] = useState<string | null>(null);

  // Initialize user rewards if not exists
  useEffect(() => {
    const existing = getLocalRewards();
    if (!existing) {
      const newUser: UserRewards = {
        userId: 1,
        totalPoints: 250,
        history: [
          {
            date: new Date().toISOString(),
            points: 250,
            action: "welcome_bonus",
          },
        ],
        redeemedRewards: [],
      };
      saveLocalRewards(newUser);
      setUserRewards(newUser);
    } else {
      setUserRewards(existing);
    }
  }, []);

  const handleActionPoints = (action: keyof typeof actionsPoints) => {
    if (!userRewards) return;
    const points = actionsPoints[action];
    const updated = addPoints(action, points);
    if (updated) {
      setUserRewards(updated);
      setRecentAction(`${action} +${points} points!`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(() => setRecentAction(null), 3000);
    }
  };

  const handleRedeem = (rewardId: number, pointsCost: number) => {
    if (!userRewards) return;
    if (userRewards.totalPoints >= pointsCost) {
      setSelectedReward(rewardId);
      const updated: UserRewards = {
        ...userRewards,
        totalPoints: userRewards.totalPoints - pointsCost,
        redeemedRewards: [
          ...userRewards.redeemedRewards,
          { rewardId, date: new Date().toISOString() },
        ],
      };
      saveLocalRewards(updated);
      setUserRewards(updated);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      alert(
        "Not enough points! Earn more by sharing trips, uploading photos, or referring friends."
      );
    }
  };

  // Calculate progress to next tier
  const getTierInfo = () => {
    const points = userRewards?.totalPoints || 0;
    if (points >= 2000)
      return { name: "Platinum Member", next: 0, color: "text-purple-300" };
    if (points >= 1000)
      return { name: "Gold Member", next: 2000 - points, color: "text-yellow-300" };
    if (points >= 500)
      return { name: "Silver Member", next: 1000 - points, color: "text-gray-300" };
    return { name: "Bronze Member", next: 500 - points, color: "text-amber-300" };
  };

  const tier = getTierInfo();
  const progressPercent = userRewards
    ? Math.min(100, Math.floor((userRewards.totalPoints / 500) * 100))
    : 0;

  if (!userRewards) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
    >
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div className="text-4xl animate-bounce">🎉✨🎊</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Action Toast */}
      <AnimatePresence>
        {recentAction && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10"
          >
            {recentAction}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Trophy size={28} className="text-yellow-300" />
          <h3 className="font-black text-xl">AM38 Rewards Club</h3>
          <Sparkles size={16} className="text-yellow-300" />
        </div>
        <div className="bg-white/20 rounded-full px-4 py-2 text-sm font-black backdrop-blur-sm">
          {userRewards.totalPoints.toLocaleString()} pts
        </div>
      </div>

      {/* Points Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Next reward: 500 pts</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Earn Points Section */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-200 flex items-center gap-1">
          <Zap size={12} /> Earn points by:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleActionPoints("share_trip")}
            className="flex items-center gap-1 bg-white/15 rounded-lg px-3 py-2 hover:bg-white/25 transition"
          >
            <Share2 size={12} /> Share trip: +50
          </button>
          <button
            onClick={() => handleActionPoints("upload_photo")}
            className="flex items-center gap-1 bg-white/15 rounded-lg px-3 py-2 hover:bg-white/25 transition"
          >
            <Camera size={12} /> Upload photo: +100
          </button>
          <button
            onClick={() => handleActionPoints("write_review")}
            className="flex items-center gap-1 bg-white/15 rounded-lg px-3 py-2 hover:bg-white/25 transition"
          >
            <Star size={12} /> Write review: +150
          </button>
          <button
            onClick={() => handleActionPoints("refer_friend")}
            className="flex items-center gap-1 bg-white/15 rounded-lg px-3 py-2 hover:bg-white/25 transition"
          >
            <Users size={12} /> Refer friend: +300
          </button>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-200 mb-2 flex items-center gap-1">
          <Gift size={12} /> Available Rewards
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableRewards.map((reward: Reward) => (
            <div
              key={reward.id}
              className="flex justify-between items-center p-3 bg-white/10 rounded-xl hover:bg-white/15 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{reward.icon}</span>
                <div>
                  <span className="text-sm font-medium">{reward.name}</span>
                  <p className="text-[10px] text-white/70">
                    {reward.description || "Limited time offer"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-yellow-300">
                  {reward.points} pts
                </span>
                <button
                  onClick={() => handleRedeem(reward.id, reward.points)}
                  disabled={userRewards.totalPoints < reward.points}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    userRewards.totalPoints >= reward.points
                      ? "bg-yellow-400 text-black hover:bg-yellow-300"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Tier */}
      <div className="rounded-xl bg-white/10 p-3 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {userRewards.totalPoints >= 1000 ? (
              <CheckCircle size={16} className="text-yellow-300" />
            ) : (
              <TrendingUp size={16} className="text-white/70" />
            )}
            <span className="text-xs font-medium">{tier.name}</span>
          </div>
          {tier.next > 0 && (
            <span className="text-[10px] text-white/50">
              {tier.next} pts to next tier
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}