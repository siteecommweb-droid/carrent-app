import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, BarChart3, Car, Ticket, FileText, Mail, CalendarDays, LogOut, Bell } from "lucide-react";
import { io } from "socket.io-client";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/reservations", label: "Reservations", icon: Calendar },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/fleet", label: "Fleet", icon: Car },
  { to: "/admin/fleet-calendar", label: "Fleet Calendar", icon: CalendarDays },
  { to: "/admin/tickets", label: "Tickets", icon: Ticket },
  { to: "/admin/invoices", label: "Invoices", icon: FileText },
  { to: "/admin/email-inbox", label: "Email Inbox", icon: Mail },
];

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "");

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<{ id: string; text: string }[]>([]);
  let user: any = {};
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {}

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  useEffect(() => {
    const socket = io(API_BASE, { transports: ["websocket"] });

    socket.on("connect", () => {
      socket.emit("join-admin");
    });

    socket.on("booking:update", (data: any) => {
      setAlerts((prev) => [{ id: `b-${Date.now()}`, text: `New booking: ${data?.reference || "reservation created"}` }, ...prev].slice(0, 5));
    });

    socket.on("ticket:refresh", (data: any) => {
      setAlerts((prev) => [{ id: `t-${Date.now()}`, text: `New ticket: ${data?.subject || "support request"}` }, ...prev].slice(0, 5));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-slate-950 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <p className="text-xl font-black">AM38 Admin</p>
          <p className="text-xs text-slate-400 mt-1 truncate">{user?.full_name || user?.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active ? "bg-red-600 text-white" : "text-slate-300 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-red-400 hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {alerts.length > 0 && (
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200 p-3 space-y-2">
            {alerts.map((a) => (
              <div key={a.id} className="flex items-center gap-2 bg-blue-50 text-blue-800 rounded-xl px-4 py-2 text-sm font-bold">
                <Bell className="h-4 w-4" /> {a.text}
              </div>
            ))}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}