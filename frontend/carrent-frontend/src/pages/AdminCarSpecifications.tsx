import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { fetchAPI } from "@/lib/api";
import { motion } from "framer-motion";
import { Edit2, Save, X, Gauge, Fuel, Cog, Users, Package, Zap } from "lucide-react";
import toast from "react-hot-toast";

type CarSpec = {
  id: number;
  make: string;
  model: string;
  year?: number;
  category?: string;
  transmission?: string;
  seats?: number;
  daily_price?: number;
  engine?: string;
  fuel_type?: string;
  horsepower?: number;
  luggage_capacity?: number;
  fuel_consumption?: string;
  zero_to_100?: string;
  features: string[];
};

export default function AdminCarSpecifications() {
  const { formatPrice } = useCurrency();
  const [cars, setCars] = useState<CarSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<CarSpec>>({});

  useEffect(() => { fetchCars(); }, []);

  async function fetchCars() {
    try {
      const data = await fetchAPI("/admin/specs/cars");
      setCars(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); toast.error("Failed to load cars"); }
    finally { setLoading(false); }
  }

  async function saveSpecs(carId: number) {
    try {
      await fetchAPI(`/admin/specs/cars/${carId}`, { method: "PUT", body: JSON.stringify(editData) });
      toast.success("Specifications updated");
      setEditingId(null);
      await fetchCars();
    } catch (err) { toast.error("Failed to save"); }
  }

  if (loading) return <div className="p-10 text-center animate-pulse">Loading vehicle specifications...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl p-6 shadow-sm border"><h1 className="text-3xl font-black text-slate-900">Car Specifications</h1><p className="text-slate-500 mt-1">Manage technical details for each vehicle</p></div>
      <div className="space-y-4">
        {cars.map((car) => (
          <motion.div key={car.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border">
            {editingId === car.id ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-xs font-bold">Engine</label><input value={editData.engine || ""} onChange={(e) => setEditData({ ...editData, engine: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                  <div><label className="text-xs font-bold">Fuel Type</label><input value={editData.fuel_type || ""} onChange={(e) => setEditData({ ...editData, fuel_type: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                  <div><label className="text-xs font-bold">Horsepower</label><input type="number" value={editData.horsepower || ""} onChange={(e) => setEditData({ ...editData, horsepower: parseInt(e.target.value) })} className="w-full p-2 border rounded-xl" /></div>
                  <div><label className="text-xs font-bold">Luggage Capacity</label><input type="number" value={editData.luggage_capacity || ""} onChange={(e) => setEditData({ ...editData, luggage_capacity: parseInt(e.target.value) })} className="w-full p-2 border rounded-xl" /></div>
                  <div><label className="text-xs font-bold">Fuel Consumption</label><input value={editData.fuel_consumption || ""} onChange={(e) => setEditData({ ...editData, fuel_consumption: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                  <div><label className="text-xs font-bold">0-100 km/h</label><input value={editData.zero_to_100 || ""} onChange={(e) => setEditData({ ...editData, zero_to_100: e.target.value })} className="w-full p-2 border rounded-xl" /></div>
                </div>
                <div className="flex gap-2"><button onClick={() => saveSpecs(car.id)} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Save size={16} />Save</button><button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"><X size={16} />Cancel</button></div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div><h2 className="text-xl font-black text-slate-900">{car.make} {car.model} <span className="text-sm font-normal text-gray-500">({car.year})</span></h2><p className="text-sm text-gray-500">{car.category} • {car.transmission} • {car.seats} seats</p><p className="text-xl font-bold text-red-600 mt-2">{formatPrice(car.daily_price || 0)}/day</p></div>
                  <button onClick={() => { setEditingId(car.id); setEditData(car); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><Edit2 size={16} />Edit Specs</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  <div className="bg-gray-50 p-3 rounded-xl"><Gauge size={16} className="text-gray-500 mb-1" /><p className="text-xs text-gray-500">Engine</p><p className="font-bold text-sm">{car.engine || "-"}</p></div>
                  <div className="bg-gray-50 p-3 rounded-xl"><Fuel size={16} className="text-gray-500 mb-1" /><p className="text-xs text-gray-500">Fuel</p><p className="font-bold text-sm">{car.fuel_type || "-"}</p></div>
                  <div className="bg-gray-50 p-3 rounded-xl"><Zap size={16} className="text-gray-500 mb-1" /><p className="text-xs text-gray-500">Horsepower</p><p className="font-bold text-sm">{car.horsepower || "-"} HP</p></div>
                  <div className="bg-gray-50 p-3 rounded-xl"><Package size={16} className="text-gray-500 mb-1" /><p className="text-xs text-gray-500">Luggage</p><p className="font-bold text-sm">{car.luggage_capacity || "-"} bags</p></div>
                  <div className="bg-gray-50 p-3 rounded-xl"><Cog size={16} className="text-gray-500 mb-1" /><p className="text-xs text-gray-500">0-100 km/h</p><p className="font-bold text-sm">{car.zero_to_100 || "-"}s</p></div>
                </div>
                {car.features?.length > 0 && (<div className="mt-3 flex flex-wrap gap-2">{car.features.map((f, i) => (<span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-xs">{f}</span>))}</div>)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}