import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Wrench,
  Fuel,
  Gauge,
  Users,
  Calendar,
  DollarSign,
  Image,
  Tag,
  Shield,
  Star,
  TrendingUp,
  BarChart3,
  Download,
  Printer,
  MapPin,
} from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useCurrency } from "@/context/CurrencyContext";

interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  status: "available" | "rented" | "maintenance" | "cleaning";
  fuel_type: string;
  transmission: string;
  seats: number;
  doors: number;
  color: string;
  plate_number: string;
  mileage: number;
  category: string;
  image_url?: string;
  group_code?: string;
  partner_id?: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export default function AdminFleet() {
  const { formatPrice } = useCurrency();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Car>>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price_per_day: 0,
    status: "available",
    fuel_type: "Petrol",
    transmission: "Manual",
    seats: 5,
    doors: 4,
    color: "White",
    plate_number: "",
    mileage: 0,
    category: "Economy",
    location: "SSR International Airport",
    group_code: "",
  });

  async function loadCars() {
    setRefreshing(true);
    try {
      const data = await fetchAPI("/cars");
      setCars(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Failed to load fleet:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  async function handleAddCar(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetchAPI("/admin/cars", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      await loadCars();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add car:", error);
      alert("Failed to add car. Please try again.");
    }
  }

  async function handleUpdateCar(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCar) return;
    try {
      await fetchAPI(`/admin/cars/${selectedCar.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      await loadCars();
      setShowEditModal(false);
      setSelectedCar(null);
      resetForm();
    } catch (error) {
      console.error("Failed to update car:", error);
      alert("Failed to update car. Please try again.");
    }
  }

  async function handleDeleteCar(id: number) {
    try {
      await fetchAPI(`/admin/cars/${id}`, {
        method: "DELETE",
      });
      await loadCars();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete car:", error);
      alert("Failed to delete car. Please try again.");
    }
  }

  async function updateCarStatus(id: number, status: Car["status"]) {
    try {
      await fetchAPI(`/admin/cars/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await loadCars();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  }

  function resetForm() {
    setFormData({
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price_per_day: 0,
      status: "available",
      fuel_type: "Petrol",
      transmission: "Manual",
      seats: 5,
      doors: 4,
      color: "White",
      plate_number: "",
      mileage: 0,
      category: "Economy",
      location: "SSR International Airport",
      group_code: "",
    });
  }

  const filteredCars = cars.filter((car) => {
    const matchesSearch = `${car.make} ${car.model} ${car.plate_number} ${car.group_code || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || car.status === filterStatus;
    const matchesCategory = filterCategory === "all" || car.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: cars.length,
    available: cars.filter(c => c.status === "available").length,
    rented: cars.filter(c => c.status === "rented").length,
    maintenance: cars.filter(c => c.status === "maintenance").length,
    cleaning: cars.filter(c => c.status === "cleaning").length,
    totalRevenue: cars.reduce((sum, c) => sum + c.price_per_day, 0),
    avgPrice: cars.length ? cars.reduce((sum, c) => sum + c.price_per_day, 0) / cars.length : 0,
  };

  const categories = [...new Set(cars.map(c => c.category))];
  const locations = [...new Set(cars.map(c => c.location))];

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "available") return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Available" };
    if (s === "rented") return { bg: "bg-blue-100", text: "text-blue-700", icon: Car, label: "Rented" };
    if (s === "maintenance") return { bg: "bg-orange-100", text: "text-orange-700", icon: Wrench, label: "Maintenance" };
    if (s === "cleaning") return { bg: "bg-purple-100", text: "text-purple-700", icon: RefreshCw, label: "Cleaning" };
    return { bg: "bg-gray-100", text: "text-gray-700", icon: AlertCircle, label: status };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading fleet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Fleet Manager
              </h1>
              <p className="text-gray-500 mt-1">Manage your vehicle inventory, track status, and optimize fleet performance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadCars}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg transition"
              >
                <Plus size={18} /> Add Vehicle
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Total Fleet" value={stats.total} icon={Car} color="blue" />
          <StatCard title="Available" value={stats.available} icon={CheckCircle} color="green" />
          <StatCard title="Rented" value={stats.rented} icon={Car} color="blue" />
          <StatCard title="Maintenance" value={stats.maintenance} icon={Wrench} color="orange" />
          <StatCard title="Cleaning" value={stats.cleaning} icon={RefreshCw} color="purple" />
          <StatCard title="Avg Daily Rate" value={formatPrice(stats.avgPrice)} icon={DollarSign} color="emerald" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                placeholder="Search by make, model, plate, or group code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
              <option value="cleaning">Cleaning</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCars.map((car) => {
              const status = getStatusBadge(car.status);
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  {/* Car Image */}
                  <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                    {car.image_url ? (
                      <img src={car.image_url} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover" />
                    ) : (
                      <Car size={64} className="text-gray-600" />
                    )}
                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </div>
                    {car.group_code && (
                      <div className="absolute top-3 left-3 bg-black/50 backdrop-blur rounded-full px-2 py-1 text-xs text-white font-bold">
                        {car.group_code}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{car.make} {car.model}</h3>
                        <p className="text-sm text-gray-500">{car.year} • {car.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-red-600">{formatPrice(car.price_per_day)}</div>
                        <div className="text-xs text-gray-400">per day</div>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Fuel size={12} /> {car.fuel_type}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Gauge size={12} /> {car.transmission}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users size={12} /> {car.seats} seats
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Tag size={12} /> {car.color}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={12} /> {car.doors} doors
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin size={12} /> {car.location?.split(" ")[0]}
                      </div>
                    </div>

                    {/* Plate & Mileage */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plate</span>
                        <span className="font-mono font-bold">{car.plate_number}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-500">Mileage</span>
                        <span>{car.mileage.toLocaleString()} km</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setFormData(car);
                          setShowEditModal(true);
                        }}
                        className="flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(car.id)}
                        className="flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-red-50 rounded-xl text-red-600 hover:bg-red-100 transition text-sm font-medium"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>

                    {/* Status Quick Actions */}
                    <div className="flex gap-1 mt-3">
                      {car.status !== "available" && (
                        <button
                          onClick={() => updateCarStatus(car.id, "available")}
                          className="flex-1 px-2 py-1 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                        >
                          Set Available
                        </button>
                      )}
                      {car.status !== "rented" && (
                        <button
                          onClick={() => updateCarStatus(car.id, "rented")}
                          className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        >
                          Set Rented
                        </button>
                      )}
                      {car.status !== "maintenance" && (
                        <button
                          onClick={() => updateCarStatus(car.id, "maintenance")}
                          className="flex-1 px-2 py-1 text-xs bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
                        >
                          Maintenance
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No vehicles found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setSelectedCar(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-xl font-black">{showAddModal ? "Add New Vehicle" : "Edit Vehicle"}</h2>
                <button onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedCar(null);
                }} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={showAddModal ? handleAddCar : handleUpdateCar} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Make *</label>
                    <input
                      type="text"
                      required
                      value={formData.make || ""}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Model *</label>
                    <input
                      type="text"
                      required
                      value={formData.model || ""}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="number"
                      value={formData.year || new Date().getFullYear()}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price Per Day (MUR)</label>
                    <input
                      type="number"
                      value={formData.price_per_day || 0}
                      onChange={(e) => setFormData({ ...formData, price_per_day: parseInt(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Plate Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.plate_number || ""}
                      onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.category || "Economy"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    >
                      <option>Economy</option>
                      <option>Compact</option>
                      <option>SUV</option>
                      <option>Premium</option>
                      <option>Luxury</option>
                      <option>Electric</option>
                      <option>Family 7-seater</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fuel Type</label>
                    <select
                      value={formData.fuel_type || "Petrol"}
                      onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    >
                      <option>Petrol</option>
                      <option>Diesel</option>
                      <option>Electric</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Transmission</label>
                    <select
                      value={formData.transmission || "Manual"}
                      onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    >
                      <option>Manual</option>
                      <option>Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Seats</label>
                    <input
                      type="number"
                      value={formData.seats || 5}
                      onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Doors</label>
                    <input
                      type="number"
                      value={formData.doors || 4}
                      onChange={(e) => setFormData({ ...formData, doors: parseInt(e.target.value) })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Color</label>
                    <input
                      type="text"
                      value={formData.color || "White"}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Group Code (EDAV, etc)</label>
                    <input
                      type="text"
                      value={formData.group_code || ""}
                      onChange={(e) => setFormData({ ...formData, group_code: e.target.value })}
                      placeholder="e.g., EDAV001, SUV002"
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition">
                    {showAddModal ? "Add Vehicle" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedCar(null);
                    }}
                    className="px-6 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-xl font-black mb-2">Delete Vehicle?</h3>
              <p className="text-gray-500 mb-6">This action cannot be undone. The vehicle will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteCar(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: any; color: string }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color as keyof typeof colors] || colors.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-black">{typeof value === 'number' ? value.toLocaleString() : value}</div>
          <div className="text-xs uppercase tracking-wide mt-1">{title}</div>
        </div>
        <Icon size={28} className="opacity-50" />
      </div>
    </div>
  );
}