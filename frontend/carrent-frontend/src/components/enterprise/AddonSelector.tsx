import { useState, useEffect } from "react";
import { Check, Plus, Minus, Package, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAPI } from "@/lib/api";

export type Addon = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  icon?: string;
};

export default function AddonSelector({ addons: initialAddons, onChange, carId }: { addons?: Addon[]; onChange: (selected: Addon[]) => void; carId?: number }) {
  const [addons, setAddons] = useState<Addon[]>(initialAddons || []);
  const [selected, setSelected] = useState<Addon[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (carId && !initialAddons) {
      fetchAddons();
    }
  }, [carId]);

  async function fetchAddons() {
    setLoading(true);
    try {
      const data = await fetchAPI(`/addons?carId=${carId}`);
      setAddons(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function toggle(addon: Addon) {
    const exists = selected.find(a => a.id === addon.id);
    let next: Addon[];
    if (exists) {
      next = selected.filter(a => a.id !== addon.id);
      const newQty = { ...quantities };
      delete newQty[addon.id];
      setQuantities(newQty);
    } else {
      next = [...selected, addon];
      setQuantities({ ...quantities, [addon.id]: 1 });
    }
    setSelected(next);
    onChange(next);
  }

  function updateQuantity(addonId: string, delta: number) {
    const newQty = { ...quantities, [addonId]: Math.max(1, (quantities[addonId] || 1) + delta) };
    setQuantities(newQty);
    const updatedSelected = selected.map(a => a.id === addonId ? { ...a, quantity: newQty[addonId] } : a);
    onChange(updatedSelected as Addon[]);
  }

  const totalAddonPrice = selected.reduce((sum, a) => sum + (a.price * (quantities[a.id] || 1)), 0);

  if (loading) return <div className="border rounded-xl p-6 animate-pulse">Loading addons...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between"><div className="font-bold text-lg flex items-center gap-2"><Sparkles size={18} className="text-red-500" />Boost Your Experience</div>{selected.length > 0 && <div className="text-sm text-green-600">+ MUR {totalAddonPrice.toLocaleString()}</div>}</div>
      <div className="grid gap-3">
        {addons.map((addon) => {
          const isSelected = selected.some(a => a.id === addon.id);
          const qty = quantities[addon.id] || 1;
          return (<div key={addon.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isSelected ? "bg-red-50 border-red-300 shadow-md" : "bg-white border-gray-200 hover:border-red-200"}`}>
            <div className="flex-1"><div className="font-semibold flex items-center gap-2"><Package size={16} className={isSelected ? "text-red-500" : "text-gray-400"} />{addon.name}</div>{addon.description && <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>}</div>
            <div className="text-right"><div className="font-bold text-red-600">MUR {addon.price.toLocaleString()}</div><div className="text-[10px] text-gray-400">per day</div></div>
            <button onClick={() => toggle(addon)} className={`ml-4 p-2 rounded-full transition ${isSelected ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-red-100"}`}>{isSelected ? <Check size={16} /> : <Plus size={16} />}</button>
            {isSelected && (<div className="flex items-center gap-2 ml-2"><button onClick={() => updateQuantity(addon.id, -1)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"><Minus size={14} /></button><span className="w-8 text-center font-bold">{qty}</span><button onClick={() => updateQuantity(addon.id, 1)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"><Plus size={14} /></button></div>)}
          </div>);
        })}
      </div>
    </motion.div>
  );
}