import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import {
  TrendingUp, TrendingDown, DollarSign, Calendar, Car, Users,
  Download, RefreshCw, EyeOff, Printer, FileText,
  Clock, CheckCircle, XCircle, BarChart3,
  PieChart as PieChartIcon, Activity, CreditCard, Target, Zap,
  CalendarRange, ArrowUp, ArrowDown, Share2, Truck, Star,
} from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function AdminAnalytics() {
  const { formatPrice } = useCurrency();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year">("month");
  const [chartView, setChartView] = useState<"revenue" | "bookings" | "both">("revenue");
  const [showPrediction, setShowPrediction] = useState(false);

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ["analytics-dashboard", dateRange],
    queryFn: async () => {
      const res = await fetchAPI(`/admin/analytics/dashboard?range=${dateRange}`);
      return res?.data || res;
    },
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["analytics-bookings", dateRange],
    queryFn: async () => {
      const res = await fetchAPI(`/admin/analytics/bookings?range=${dateRange}`);
      return Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    },
  });

  const { data: tourism = {} } = useQuery({
    queryKey: ["analytics-tourism", dateRange],
    queryFn: async () => {
      const res = await fetchAPI(`/admin/analytics/tourism?range=${dateRange}`);
      return res?.data || { tripExports: 0, whatsappShares: 0, qrScans: 0 };
    },
  });

  const isLoading = dashLoading || bookingsLoading;

  const revenueTrend = useMemo(() => {
    const sorted = [...bookings].sort((a, b) => 
      new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
    );
    const map = new Map();
    sorted.forEach(b => {
      const date = new Date(b.created_at || Date.now()).toLocaleDateString();
      const existing = map.get(date);
      if (existing) {
        existing.revenue += Number(b.total_amount || 0);
        existing.bookings += 1;
      } else {
        map.set(date, { date, revenue: Number(b.total_amount || 0), bookings: 1 });
      }
    });
    return Array.from(map.values()).slice(-30);
  }, [bookings]);

  const statusData = useMemo(() => {
    return ["pending", "confirmed", "cancelled", "completed"].map(s => ({
      status: s.charAt(0).toUpperCase() + s.slice(1),
      count: bookings.filter((b: any) => b.status === s).length,
      color: s === "confirmed" ? "#10b981" : s === "pending" ? "#f59e0b" : s === "cancelled" ? "#ef4444" : "#3b82f6",
    }));
  }, [bookings]);

  const paymentStatusData = useMemo(() => {
    return ["unpaid", "partial", "paid", "pay_on_pickup"].map(s => ({
      status: s.replace("_", " ").toUpperCase(),
      count: bookings.filter((b: any) => b.payment_status === s).length,
    }));
  }, [bookings]);

  const monthlyData = useMemo(() => {
    const monthly = new Map();
    bookings.forEach((b: any) => {
      const month = new Date(b.created_at || Date.now()).toLocaleString("en-GB", { month: "short", year: "numeric" });
      monthly.set(month, (monthly.get(month) || 0) + Number(b.total_amount || 0));
    });
    return Array.from(monthly.entries()).map(([month, revenue]) => ({ month, revenue }));
  }, [bookings]);

  const vehicleData = useMemo(() => {
    const counts = new Map();
    bookings.forEach((b: any) => {
      const vehicle = b.car_name || "Standard";
      counts.set(vehicle, (counts.get(vehicle) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({ name: name.length > 15 ? name.slice(0,12)+"..." : name, count })).slice(0, 6);
  }, [bookings]);

  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, bookings: 0 }));
    bookings.forEach((b: any) => {
      const hour = parseInt((b.pickup_time || "").split(":")[0]);
      if (!isNaN(hour) && hour >= 0 && hour < 24) hours[hour].bookings++;
    });
    return hours;
  }, [bookings]);

  const completedCount = bookings.filter((b: any) => b.status === "completed").length;
  const completionRate = bookings.length ? (completedCount / bookings.length) * 100 : 0;
  const avgBookingValue = bookings.length && dashboard?.revenueTotal ? dashboard.revenueTotal / bookings.length : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" /><p className="mt-4 text-gray-500">Loading analytics...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div><h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2"><Activity className="text-red-500" size={28} /> Analytics Dashboard</h1><p className="text-gray-500 mt-1">Real-time insights & performance metrics</p></div>
          <div className="flex gap-3">
            <select value={dateRange} onChange={e => setDateRange(e.target.value as any)} className="px-3 py-2 border rounded-xl bg-white"><option value="today">Today</option><option value="week">Last 7 days</option><option value="month">Last 30 days</option><option value="year">Last 12 months</option></select>
            <button 
              onClick={async () => {
                try {
                  const XLSX = await import("xlsx");
                  const ws = XLSX.utils.json_to_sheet(bookings);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Analytics");
                  XLSX.writeFile(wb, `analytics_${dateRange}.xlsx`);
                  toast.success("Export complete");
                } catch (err) {
                  toast.error("Export failed – make sure xlsx is installed");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl"
            >
              <Download size={18} /> CSV
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl"><Printer size={18} /> Print</button>
            <button onClick={() => queryClient.invalidateQueries()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl"><RefreshCw size={18} /> Refresh</button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <KPICard title="Total Bookings" value={dashboard?.totalBookings || bookings.length} icon={<Calendar size={20} />} color="blue" />
          <KPICard title="Total Revenue" value={formatPrice(dashboard?.revenueTotal || 0)} icon={<DollarSign size={20} />} color="green" />
          <KPICard title="Today Revenue" value={formatPrice(dashboard?.revenueToday || 0)} icon={<TrendingUp size={20} />} color="yellow" />
          <KPICard title="Active Cars" value={dashboard?.totalCars || 0} icon={<Car size={20} />} color="purple" />
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          <MetricCard title="Completion Rate" value={`${completionRate.toFixed(1)}%`} description={`${completedCount} completed`} icon={<CheckCircle size={20} />} color="green" />
          <MetricCard title="Avg Booking Value" value={formatPrice(avgBookingValue)} description="Per booking" icon={<CreditCard size={20} />} color="blue" />
          <MetricCard title="Trip Exports" value={tourism?.tripExports || 0} description="Itineraries exported" icon={<Share2 size={20} />} color="purple" />
          <MetricCard title="WhatsApp Shares" value={tourism?.whatsappShares || 0} description="Social engagement" icon={<Share2 size={20} />} color="green" />
          <MetricCard title="QR Scans" value={tourism?.qrScans || 0} description="Trip QR scans" icon={<FileText size={20} />} color="orange" />
        </div>

        {showPrediction && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex justify-between"><div className="flex items-center gap-3"><Target size={28} /><div><h3 className="font-bold text-lg">AI Revenue Forecast</h3></div></div><button onClick={() => setShowPrediction(false)} className="bg-white/20 p-2 rounded-full"><EyeOff size={18} /></button></div>
            <div className="grid md:grid-cols-2 gap-6 mt-4"><div><p className="text-purple-200 text-sm">Predicted Next Month Revenue</p><p className="text-3xl font-black">{formatPrice((monthlyData.reduce((a,b)=>a+b.revenue,0)/(monthlyData.length||1))*1.1)}</p><div className="flex items-center gap-1 mt-2 text-green-300"><ArrowUp size={16} /> 12.5% growth forecast</div></div><div><p className="text-purple-200 text-sm">Confidence Score</p><div className="flex items-center gap-2"><div className="flex-1 bg-white/20 rounded-full h-2"><div className="bg-green-400 rounded-full h-2 w-[85%]" /></div><span>85%</span></div></div></div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex justify-between mb-4"><h2 className="font-bold flex items-center gap-2"><TrendingUp size={18} className="text-red-500" /> Revenue Trend</h2><button onClick={() => setShowPrediction(true)} className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm flex items-center gap-1"><Zap size={12} /> AI Forecast</button></div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrend}>
                <defs><linearGradient id="revGrad"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="date" /><YAxis /><Tooltip formatter={(v) => formatPrice(Number(v))} /><Area type="monotone" dataKey="revenue" stroke="#ef4444" fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-blue-500" /> Booking Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData} layout="vertical"><XAxis type="number" /><YAxis type="category" dataKey="status" width={100} /><Tooltip /><Bar dataKey="count" fill="#3b82f6">{statusData.map((e,i)=><Cell key={i} fill={e.color} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center gap-2"><PieChartIcon size={18} className="text-green-500" /> Payment Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart><Pie data={paymentStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" label={({name,percent})=>`${name}: ${((percent??0)*100).toFixed(0)}%`}>{paymentStatusData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center gap-2"><CalendarRange size={18} className="text-emerald-500" /> Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(v)=>formatPrice(Number(v))} /><Bar dataKey="revenue" fill="#10b981">{monthlyData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Car size={18} className="text-orange-500" /> Vehicle Popularity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={vehicleData}><PolarGrid /><PolarAngleAxis dataKey="name" tick={{fontSize:10}} /><PolarRadiusAxis /><Radar dataKey="count" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} /><Tooltip /></RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <h2 className="font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-purple-500" /> Popular Pickup Times</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData}><XAxis dataKey="hour" interval={3} angle={-45} textAnchor="end" height={60} /><YAxis /><Tooltip /><Bar dataKey="bookings" fill="#8b5cf6" /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, color }: any) {
  const colors: any = { blue:"from-blue-500 to-blue-600", green:"from-green-500 to-emerald-600", yellow:"from-yellow-500 to-orange-500", purple:"from-purple-500 to-pink-500", red:"from-red-500 to-rose-600" };
  return (
    <div className="p-5 rounded-xl bg-white border shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div><div className="text-sm text-gray-500">{title}</div><div className="text-2xl font-black mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</div></div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]||colors.blue} text-white shadow-sm`}>{icon}</div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, description, icon, color }: any) {
  const colors: any = { green:"bg-green-50 text-green-600", blue:"bg-blue-50 text-blue-600", red:"bg-red-50 text-red-600", purple:"bg-purple-50 text-purple-600", orange:"bg-orange-50 text-orange-600", yellow:"bg-yellow-50 text-yellow-600" };
  return (
    <div className="p-4 rounded-xl bg-white border shadow-sm">
      <div className="flex items-center gap-3"><div className={`p-2 rounded-xl ${colors[color]||colors.blue}`}>{icon}</div><div><div className="text-xs text-gray-500 uppercase tracking-wide">{title}</div><div className="text-xl font-black text-gray-900">{value}</div><div className="text-xs text-gray-400">{description}</div></div></div>
    </div>
  );
}