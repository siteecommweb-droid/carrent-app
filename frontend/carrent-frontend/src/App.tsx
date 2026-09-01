import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";

import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import AdminRoute from "./components/AdminRoute";

import Landing from "./pages/Landing";
import Cars from "./pages/Cars";
import Extras from "./pages/Extras";
import DriverDetails from "./pages/DriverDetails";
import Payment from "./pages/Payment";
import Confirmation from "./pages/Confirmation";
import MyReservations from "./pages/MyReservations";
import Explore from "./pages/Explore";
import Partners from "./pages/Partners";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OAuthSuccess from "./pages/OAuthSuccess";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import GDPR from "./pages/GDPR";
import { SpotlightProvider } from "./context/SpotlightContext";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminFleet from "./pages/admin/AdminFleet";
import AdminFleetCalendar from "./pages/admin/AdminFleetCalendar";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminEmailInbox from "./pages/admin/AdminEmailInbox";
import AdminRefunds from "./pages/admin/AdminRefunds";  // <-- NEW

const Legal = () => <div />;

function App() {
  // ===== Socket.IO listener for live admin updates =====
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000");

    socket.on("booking:update", (data) => {
      console.log("[Socket] New booking update:", data);
    });

    socket.on("ticket:refresh", (data) => {
      console.log("[Socket] Ticket update:", data);
    });

    socket.on("payment:received", (data) => {
      console.log("[Socket] Payment received:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  // =====================================================

  return (
    <SpotlightProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/extras" element={<Extras />} />
          <Route path="/driver-details" element={<DriverDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/legal" element={<Legal />} />
        </Route>

        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/fleet" element={<AdminFleet />} />
          <Route path="/admin/fleet-calendar" element={<AdminFleetCalendar />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/admin/email-inbox" element={<AdminEmailInbox />} />
          <Route path="/admin/refunds" element={<AdminRefunds />} />  {/* NEW */}
        </Route>
      </Routes>
    </SpotlightProvider>
  );
}

export default App;