let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await q("SELECT COUNT(*) as count FROM reservations");
    const totalUsers = await q("SELECT COUNT(*) as count FROM app_users WHERE role = 'user'");
    const totalRevenue = await q("SELECT SUM(grand_total_mur) as total FROM reservations WHERE status != 'cancelled'");
    const activeBookings = await q("SELECT COUNT(*) as count FROM reservations WHERE status IN ('confirmed', 'pending')");
    const pendingTickets = await q("SELECT COUNT(*) as count FROM tickets WHERE status = 'open'");
    const revenueToday = await q("SELECT SUM(grand_total_mur) as total FROM reservations WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'");
    const carsStats = await q("SELECT COUNT(*) as total, SUM(available) as availableCount FROM cars");

    const totalCars = carsStats[0].total || 0;
    const availableCars = Number(carsStats[0].availableCount || 0);
    const occupancyRate = totalCars ? Math.round(((totalCars - availableCars) / totalCars) * 100) : 0;

    res.json({
      totalBookings: totalBookings[0].count,
      totalUsers: totalUsers[0].count,
      totalRevenue: totalRevenue[0].total || 0,
      activeBookings: activeBookings[0].count,
      pendingTickets: pendingTickets[0].count,
      revenueTotal: totalRevenue[0].total || 0,
      revenueToday: revenueToday[0].total || 0,
      totalCars,
      completedToday: 0, // reservations has no status-change timestamp yet — needs a schema addition to compute accurately
      pendingApproval: pendingTickets[0].count,
      averageRating: 0, // no ratings table confirmed yet
      occupancyRate,
    });
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getRevenueReport = async (req, res) => {
  const { period = "month" } = req.query;
  try {
    let groupBy;
    if (period === "day") groupBy = "DATE(created_at)";
    else if (period === "week") groupBy = "YEARWEEK(created_at)";
    else groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
    const sql = `SELECT ${groupBy} as period, SUM(grand_total_mur) as revenue, COUNT(*) as bookings FROM reservations WHERE status != 'cancelled' GROUP BY period ORDER BY period DESC LIMIT 12`;
    const results = await q(sql);
    res.json(results);
  } catch (error) {
    console.error("getRevenueReport error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingsAnalytics = async (req, res) => {
  try {
    const byStatus = await q("SELECT status, COUNT(*) as count FROM reservations GROUP BY status");
    res.json({ byStatus });
  } catch (error) {
    console.error("getBookingsAnalytics error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getFleetUtilization = async (req, res) => {
  try {
    const cars = await q(`
      SELECT c.id, c.brand, c.model, c.available,
             COUNT(r.id) as booking_count
      FROM cars c
      LEFT JOIN reservations r ON r.car_id = c.id AND r.status != 'cancelled'
      GROUP BY c.id
    `);
    res.json(cars);
  } catch (error) {
    console.error("getFleetUtilization error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const rows = await q("SELECT id, email, role, first_name, last_name, phone FROM app_users ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("listUsers error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const { role } = req.body;
    await q("UPDATE app_users SET role = ? WHERE id = ?", [role, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("updateUserRole error:", error);
    res.status(500).json({ message: error.message });
  }
};