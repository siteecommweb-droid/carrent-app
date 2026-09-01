import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trophy, Upload, X, Star, Share2 } from "lucide-react";

interface ContestPost {
  id: number;
  file: File;
  previewUrl: string;
  votes: number;
  votedBy: string[];
  createdAt: Date;
  caption: string;
}

export default function ContestSystem() {
  const [posts, setPosts] = useState<ContestPost[]>([]);
  const [caption, setCaption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userVotes, setUserVotes] = useState<Record<number, boolean>>({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("contest_posts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPosts(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        file: null // files can't be serialized
      })));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const toSave = posts.map(p => ({
      ...p,
      file: undefined,
      previewUrl: p.previewUrl
    }));
    localStorage.setItem("contest_posts", JSON.stringify(toSave));
  }, [posts]);

  function addPost(file?: File, captionText?: string) {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const newPost: ContestPost = {
      id: Date.now(),
      file,
      previewUrl,
      votes: 0,
      votedBy: [],
      createdAt: new Date(),
      caption: captionText || "",
    };

    setPosts((prev) => [newPost, ...prev]);
    setShowModal(false);
    setSelectedFile(null);
    setCaption("");
  }

  function vote(id: number) {
    if (userVotes[id]) return;
    
    setPosts((prev) =>
      prev.map((p) => 
        p.id === id 
          ? { ...p, votes: p.votes + 1, votedBy: [...p.votedBy, "current_user"] } 
          : p
      )
    );
    setUserVotes(prev => ({ ...prev, [id]: true }));
  }

  const topPosts = [...posts].sort((a, b) => b.votes - a.votes).slice(0, 3);

  return (
    <div className="space-y-6 rounded-2xl border bg-white p-6 text-black">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            AM38 Trip Contest
          </h2>
          <p className="text-sm text-black/50 mt-1">
            Share your best Mauritius road trip moments and win amazing prizes!
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-xl bg-black px-5 py-3 text-white font-semibold hover:bg-black/90 transition flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Share Your Trip
        </button>
      </div>

      {/* Leaderboard */}
      {topPosts.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="font-bold">🏆 Leaderboard Top 3</span>
          </div>
          <div className="space-y-2">
            {topPosts.map((post, idx) => (
              <div key={post.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">
                    {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                  </span>
                  <span className="text-sm truncate max-w-[200px]">
                    {post.caption || `Trip #${post.id}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <span className="font-bold">{post.votes}</span>
                  <span className="text-xs text-black/50">votes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {posts.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded-xl border overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={p.previewUrl}
                alt={p.caption || "Contest entry"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-black/70 mb-2">{p.caption || "Amazing Mauritius trip!"}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => vote(p.id)}
                      disabled={userVotes[p.id]}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full transition ${
                        userVotes[p.id]
                          ? "bg-red-100 text-red-600 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-red-100 hover:text-red-600"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${userVotes[p.id] ? "fill-red-500" : ""}`} />
                      <span className="text-sm font-semibold">{p.votes}</span>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-xs text-black/40">
                    {p.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-black/50">
          <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No entries yet. Be the first to share your trip!</p>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black">Share Your Trip</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full border rounded-xl p-3 mb-3"
            />
            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border rounded-xl p-3 mb-4"
            />
            <button
              onClick={() => addPost(selectedFile || undefined, caption)}
              disabled={!selectedFile}
              className="w-full rounded-xl bg-black text-white py-3 font-semibold disabled:opacity-50"
            >
              Submit Entry
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}