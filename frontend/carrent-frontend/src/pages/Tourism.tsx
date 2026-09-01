import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Heart,
  Share2,
  Search,
  Plane,
  Sparkles,
  Navigation,
  Camera,
  Waves,
  Mountain,
  Compass,
  Calendar,
  Car,
  Route,
  Sun,
} from "lucide-react";

interface Review {
  text: string;

  rating: number;

  date: Date;

  traveler?: string;
}

interface TourismPlace {
  name: string;

  description: string;

  rating: number;

  location: string;

  openingHours: string;

  contact: string;

  website: string;

  image: string;

  category: string;

  price: string;

  region: string;

  tags: string[];

  duration: string;

  bestTime: string;

  coordinates: {
    lat: number;

    lng: number;
  };

  recommendedVehicle:
    | "SUV"
    | "Compact"
    | "Luxury"
    | "4x4";

  featured?: boolean;
}

const places: TourismPlace[] =
  [
    {
      name:
        "Le Morne Brabant",

      description:
        "UNESCO World Heritage mountain with paradise lagoon and luxury beach views.",

      rating: 5,

      location:
        "Le Morne, Mauritius",

      openingHours:
        "Sunrise to Sunset",

      contact:
        "+230 123 4567",

      website:
        "https://lemorne.mu",

      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",

      category:
        "Mountain",

      price: "Free",

      region:
        "South West",

      duration:
        "4-6 Hours",

      bestTime:
        "Morning",

      recommendedVehicle:
        "SUV",

      featured: true,

      tags: [
        "Beach",
        "UNESCO",
        "Hiking",
        "Luxury",
      ],

      coordinates: {
        lat: -20.459,
        lng: 57.326,
      },
    },

    {
      name:
        "Chamarel Waterfall",

      description:
        "Mauritius iconic waterfall with Seven Colored Earth and rainforest views.",

      rating: 5,

      location:
        "Chamarel, Mauritius",

      openingHours:
        "8:30 AM - 5:00 PM",

      contact:
        "+230 483 4200",

      website:
        "https://chamarel.mu",

      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",

      category:
        "Nature",

      price:
        "Rs 200",

      region:
        "South West",

      duration:
        "2-4 Hours",

      bestTime:
        "Afternoon",

      recommendedVehicle:
        "SUV",

      featured: true,

      tags: [
        "Nature",
        "Waterfall",
        "Photography",
      ],

      coordinates: {
        lat: -20.425,
        lng: 57.403,
      },
    },

    {
      name:
        "Île aux Cerfs",

      description:
        "Luxury island paradise with crystal lagoon and water sports.",

      rating: 5,

      location:
        "Trou d'Eau Douce",

      openingHours:
        "9:00 AM - 5:00 PM",

      contact:
        "+230 452 1234",

      website:
        "https://ileauxcerfs.mu",

      image:
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98",

      category:
        "Beach",

      price:
        "Boat transfer Rs 500",

      region:
        "East",

      duration:
        "Full Day",

      bestTime:
        "Morning",

      recommendedVehicle:
        "Luxury",

      featured: true,

      tags: [
        "Island",
        "Luxury",
        "Water Sports",
      ],

      coordinates: {
        lat: -20.274,
        lng: 57.804,
      },
    },

    {
      name:
        "Grand Baie",

      description:
        "Premium nightlife, beaches, luxury shopping and restaurants.",

      rating: 4,

      location:
        "Grand Baie",

      openingHours:
        "24/7",

      contact:
        "+230 263 4567",

      website:
        "https://grandbaie.mu",

      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",

      category:
        "Beach",

      price:
        "Free",

      region:
        "North",

      duration:
        "Flexible",

      bestTime:
        "Night",

      recommendedVehicle:
        "Luxury",

      tags: [
        "Nightlife",
        "Shopping",
        "Beach",
      ],

      coordinates: {
        lat: -20.015,
        lng: 57.58,
      },
    },

    {
      name:
        "Black River Gorges",

      description:
        "National park with hiking, wildlife and panoramic viewpoints.",

      rating: 5,

      location:
        "Black River",

      openingHours:
        "6:00 AM - 6:00 PM",

      contact:
        "+230 464 4016",

      website:
        "https://nationalparks.govmu.org",

      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",

      category:
        "Nature",

      price:
        "Free",

      region:
        "West",

      duration:
        "Full Day",

      bestTime:
        "Morning",

      recommendedVehicle:
        "4x4",

      tags: [
        "Hiking",
        "Forest",
        "Adventure",
      ],

      coordinates: {
        lat: -20.408,
        lng: 57.446,
      },
    },
  ];

export default function Tourism() {
  const [reviews, setReviews] =
    useState<Review[]>([]);

  const [text, setText] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const [favorites, setFavorites] =
    useState<number[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState("all");

  useEffect(() => {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "tourism_reviews"
          ) || "[]"
        );

      setReviews(saved);
    } catch {}
  }, []);

  const categories = [
    "all",
    ...new Set(
      places.map(
        (p) => p.category
      )
    ),
  ];

  const regions = [
    "all",
    ...new Set(
      places.map(
        (p) => p.region
      )
    ),
  ];

  const filteredPlaces =
    useMemo(() => {
      return places.filter(
        (p) => {
          const categoryMatch =
            selectedCategory ===
              "all" ||
            p.category ===
              selectedCategory;

          const regionMatch =
            selectedRegion ===
              "all" ||
            p.region ===
              selectedRegion;

          const searchMatch =
            p.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            p.description
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            categoryMatch &&
            regionMatch &&
            searchMatch
          );
        }
      );
    }, [
      selectedCategory,
      selectedRegion,
      search,
    ]);

  const addReview = () => {
    if (!text) return;

    const updated = [
      {
        text,

        rating,

        traveler:
          "Traveler",

        date: new Date(),
      },

      ...reviews,
    ];

    setReviews(updated);

    localStorage.setItem(
      "tourism_reviews",
      JSON.stringify(
        updated
      )
    );

    setText("");

    setRating(5);
  };

  const toggleFavorite = (
    index: number
  ) => {
    setFavorites((prev) =>
      prev.includes(index)
        ? prev.filter(
            (i) =>
              i !== index
          )
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">

      {/* HERO */}

      <div className="relative overflow-hidden bg-gradient-to-r from-[#165db8] via-cyan-500 to-[#0f172a] text-white">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_35%)]" />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur mb-6">
              <Sparkles className="h-4 w-4" />
              Mauritius Smart Tourism Engine
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Explore
              Mauritius
            </h1>

            <p className="mt-6 text-xl text-white/80 leading-relaxed">
              Discover beaches,
              waterfalls,
              luxury tourism,
              hidden gems,
              mountain adventures,
              nightlife,
              and AI-powered
              travel experiences.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <button className="rounded-2xl bg-white text-[#165db8] px-6 py-4 font-black shadow-xl hover:scale-[1.02] transition">
                Start Exploring
              </button>

              <button className="rounded-2xl border border-white/20 bg-white/10 px-6 py-4 font-black backdrop-blur">
                Plan My Route
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* SEARCH */}

        <div className="rounded-3xl border bg-white shadow-xl p-6">

          <div className="grid lg:grid-cols-[1fr_220px_220px] gap-4">

            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-black/40" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search beaches, mountains, waterfalls, luxury destinations..."
                className="w-full rounded-2xl border pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-[#165db8]"
              />
            </div>

            <select
              value={
                selectedCategory
              }
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="rounded-2xl border px-4 py-4"
            >
              {categories.map(
                (cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                )
              )}
            </select>

            <select
              value={
                selectedRegion
              }
              onChange={(e) =>
                setSelectedRegion(
                  e.target.value
                )
              }
              className="rounded-2xl border px-4 py-4"
            >
              {regions.map(
                (region) => (
                  <option
                    key={region}
                    value={
                      region
                    }
                  >
                    {region}
                  </option>
                )
              )}
            </select>

          </div>
        </div>

        {/* FEATURED */}

        <div className="grid lg:grid-cols-4 gap-6">

          <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-8 shadow-xl">
            <Plane className="h-10 w-10 mb-4" />

            <div className="text-3xl font-black">
              Airport
            </div>

            <div className="text-white/80 mt-2">
              Smart transfer booking system
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-green-500 text-white p-8 shadow-xl">
            <Mountain className="h-10 w-10 mb-4" />

            <div className="text-3xl font-black">
              Hiking
            </div>

            <div className="text-white/80 mt-2">
              AI scenic route recommendations
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 shadow-xl">
            <Waves className="h-10 w-10 mb-4" />

            <div className="text-3xl font-black">
              Beaches
            </div>

            <div className="text-white/80 mt-2">
              Luxury beach experiences
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white p-8 shadow-xl">
            <Compass className="h-10 w-10 mb-4" />

            <div className="text-3xl font-black">
              AI Guide
            </div>

            <div className="text-white/80 mt-2">
              Smart tourism intelligence
            </div>
          </div>

        </div>

        {/* PLACES */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filteredPlaces.map(
            (p, idx) => (
              <div
                key={idx}
                className="rounded-3xl overflow-hidden border bg-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
              >

                <div className="relative h-64 overflow-hidden">

                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <button
                    onClick={() =>
                      toggleFavorite(
                        idx
                      )
                    }
                    className="absolute top-4 right-4 h-12 w-12 rounded-2xl bg-white/90 backdrop-blur flex items-center justify-center"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.includes(
                          idx
                        )
                          ? "fill-red-500 text-red-500"
                          : "text-black"
                      }`}
                    />
                  </button>

                  {p.featured && (
                    <div className="absolute top-4 left-4 rounded-full bg-yellow-400 text-black px-4 py-2 text-xs font-black">
                      Featured
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-white">

                    <div className="flex items-center gap-2 mb-2">

                      {[...Array(
                        p.rating
                      )].map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        )
                      )}

                    </div>

                    <div className="text-3xl font-black">
                      {p.name}
                    </div>

                  </div>
                </div>

                <div className="p-6">

                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.tags.map(
                      (tag) => (
                        <div
                          key={tag}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold"
                        >
                          {tag}
                        </div>
                      )
                    )}
                  </div>

                  <p className="text-black/60 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-[#165db8]" />
                      {p.location}
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-[#165db8]" />
                      {p.openingHours}
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-[#165db8]" />
                      Best Time:
                      {p.bestTime}
                    </div>

                    <div className="flex items-center gap-3">
                      <Car className="h-4 w-4 text-[#165db8]" />
                      Recommended:
                      {p.recommendedVehicle}
                    </div>

                    <div className="flex items-center gap-3">
                      <Route className="h-4 w-4 text-[#165db8]" />
                      Duration:
                      {p.duration}
                    </div>

                  </div>

                  <div className="mt-6 flex items-center justify-between">

                    <div>
                      <div className="text-xs text-black/40">
                        Starting From
                      </div>

                      <div className="text-xl font-black text-[#165db8]">
                        {p.price}
                      </div>
                    </div>

                    <div className="flex gap-2">

                      <button className="h-12 w-12 rounded-2xl border flex items-center justify-center hover:bg-slate-50">
                        <Share2 className="h-5 w-5" />
                      </button>

                      <a
                        href={p.website}
                        target="_blank"
                        rel="noreferrer"
                        className="h-12 w-12 rounded-2xl border flex items-center justify-center hover:bg-slate-50"
                      >
                        <Globe className="h-5 w-5" />
                      </a>

                    </div>
                  </div>

                  <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#165db8] to-cyan-500 text-white py-4 font-black shadow-lg hover:scale-[1.01] transition">
                    Book Experience
                  </button>

                </div>
              </div>
            )
          )}

        </div>

        {/* REVIEWS */}

        <div className="rounded-3xl border bg-white shadow-xl p-8">

          <div className="flex items-center justify-between mb-6">

            <div>
              <div className="text-3xl font-black">
                Traveler Reviews
              </div>

              <div className="text-black/50 mt-1">
                Share your Mauritius experience
              </div>
            </div>

            <div className="rounded-2xl bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700 flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Tourism Community
            </div>

          </div>

          <div className="space-y-5">

            <textarea
              value={text}
              onChange={(e) =>
                setText(
                  e.target.value
                )
              }
              placeholder="Tell travelers about your Mauritius adventure..."
              rows={4}
              className="w-full rounded-2xl border p-5 outline-none focus:ring-2 focus:ring-[#165db8]"
            />

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-2">

                {[1, 2, 3, 4, 5].map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setRating(
                          r
                        )
                      }
                    >
                      <Star
                        className={`h-8 w-8 ${
                          r <=
                          rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  )
                )}

              </div>

              <button
                onClick={
                  addReview
                }
                className="rounded-2xl bg-black text-white px-8 py-4 font-black hover:bg-black/90"
              >
                Submit Review
              </button>

            </div>

            <div className="space-y-4 mt-8">

              {reviews.length ===
              0 ? (
                <div className="rounded-3xl border border-dashed p-16 text-center text-black/40">
                  <Camera className="h-14 w-14 mx-auto mb-4 opacity-40" />

                  No reviews yet
                </div>
              ) : (
                reviews.map(
                  (
                    r,
                    i
                  ) => (
                    <div
                      key={i}
                      className="rounded-3xl border p-6"
                    >

                      <div className="flex items-center justify-between mb-3">

                        <div className="flex items-center gap-3">

                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-[#165db8] to-cyan-500 text-white flex items-center justify-center font-black">
                            T
                          </div>

                          <div>
                            <div className="font-black">
                              {
                                r.traveler
                              }
                            </div>

                            <div className="text-xs text-black/40">
                              {new Date(
                                r.date
                              ).toLocaleDateString()}
                            </div>
                          </div>

                        </div>

                        <div className="flex">
                          {[...Array(
                            r.rating
                          )].map(
                            (
                              _,
                              j
                            ) => (
                              <Star
                                key={j}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            )
                          )}
                        </div>

                      </div>

                      <div className="text-black/70 leading-relaxed">
                        {r.text}
                      </div>

                    </div>
                  )
                )
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}