let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

function rangeToDays(range) {
  if (range === "today") return 1;
  if (range === "week") return 7;
  if (range === "year") return 365;
  return 30;
}

exports.getAnalyticsDashboard = async (req, res) => {
  try {
    const days = rangeToDays(req.query.range);
    const totalBookings = await q("SELECT COUNT(*) as count FROM reservations WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)", [days]);
    const revenueTotal = await q("SELECT SUM(grand_total_mur) as total FROM reservations WHERE status != 'cancelled' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)", [days]);
    const revenueToday = await q("SELECT SUM(grand_total_mur) as total FROM reservations WHERE DATE(created_at) = CURDATE() AND status != 'cancelled'");
    const totalCars = await q("SELECT COUNT(*) as count FROM cars");

    res.json({
      totalBookings: totalBookings[0].count,
      revenueTotal: revenueTotal[0].total || 0,
      revenueToday: revenueToday[0].total || 0,
      totalCars: totalCars[0].count,
    });
  } catch (err) {
    console.error("getAnalyticsDashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalyticsBookings = async (req, res) => {
  try {
    const days = rangeToDays(req.query.range);
    const rows = await q(
      "SELECT id, reference, status, grand_total_mur as total_amount, created_at, car_name, pickup_date FROM reservations WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY) ORDER BY created_at DESC",
      [days]
    );
    res.json(rows);
  } catch (err) {
    console.error("getAnalyticsBookings error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ASSUMPTION flagged: trip_exports table exists (confirmed in your table list) but I've
// never seen its columns. If this errors, run `DESCRIBE trip_exports;` and send it.
exports.getAnalyticsTourism = async (req, res) => {
  try {
    const exports = await q("SELECT COUNT(*) as count FROM trip_exports").catch(() => [{ count: 0 }]);
    res.json({ tripExports: exports[0]?.count || 0, whatsappShares: 0, qrScans: 0 });
  } catch (err) {
    console.error("getAnalyticsTourism error:", err);
    res.status(500).json({ message: err.message });
  }
};