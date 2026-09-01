import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X } from "lucide-react";

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  image: string;
}

const mauritiusLocations: MapLocation[] = [
  { id: 1, name: "SSR International Airport", lat: -20.4302, lng: 57.6836, category: "Airport", description: "Main international airport", image: "/airport.jpeg" },
  { id: 2, name: "Port Louis", lat: -20.1609, lng: 57.5012, category: "City", description: "Capital city", image: "" },
  { id: 3, name: "Grand Baie", lat: -20.0182, lng: 57.5796, category: "Beach", description: "Popular beach town", image: "" },
  { id: 4, name: "Flic en Flac", lat: -20.2771, lng: 57.3632, category: "Beach", description: "Beautiful beach", image: "" },
  { id: 5, name: "Le Morne", lat: -20.4509, lng: 57.3203, category: "Mountain", description: "UNESCO site", image: "" },
  { id: 6, name: "Chamarel", lat: -20.415, lng: 57.357, category: "Nature", description: "Seven Coloured Earth", image: "" },
  { id: 7, name: "Curepipe", lat: -20.3147, lng: 57.5208, category: "City", description: "Central town", image: "" },
  { id: 8, name: "Belle Mare", lat: -20.1775, lng: 57.7692, category: "Beach", description: "East coast beach", image: "" },
];

export default function MauritiusMap() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="relative bg-gradient-to-br from-blue-900/30 to-emerald-900/30 rounded-2xl p-4 border border-white/20">
      <h3 className="font-bold mb-3 flex items-center gap-2"><MapPin size={16} /> Interactive Map of Mauritius</h3>
      <div className="relative h-96 rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('/mauritius-map-bg.jpg')" }}>
        <svg viewBox="0 0 800 600" className="w-full h-full absolute inset-0">
          {mauritiusLocations.map((loc) => (
            <g key={loc.id}>
              <circle 
                cx={400 + (loc.lng - 57.5) * 60} 
                cy={300 + (loc.lat + 20.3) * 80} 
                r={hoveredId === loc.id ? 12 : 8} 
                fill="red" 
                stroke="white" 
                strokeWidth="2" 
                className="cursor-pointer transition-all duration-200" 
                onMouseEnter={() => setHoveredId(loc.id)} 
                onMouseLeave={() => setHoveredId(null)} 
                onClick={() => setSelectedLocation(loc)}
              />
              <text 
                x={400 + (loc.lng - 57.5) * 60 + 10} 
                y={300 + (loc.lat + 20.3) * 80} 
                fill="white" 
                fontSize="10" 
                className="font-bold drop-shadow-md"
              >
                {loc.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <AnimatePresence>
        {selectedLocation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }} 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 shadow-2xl w-80"
          >
            <button onClick={() => setSelectedLocation(null)} className="absolute top-3 right-3 text-gray-500"><X size={20} /></button>
            <h4 className="font-bold text-xl text-slate-900">{selectedLocation.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{selectedLocation.description}</p>
            <p className="text-xs text-gray-400 mt-2">Category: {selectedLocation.category}</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold w-full">Add to Trip</button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-xs text-white/50 mt-3 text-center">Click on any location to explore</p>
    </div>
  );
}