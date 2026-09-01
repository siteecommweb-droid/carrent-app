let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

// Staff/admin creates a refund request once a car is returned and inspected clean
exports.createRefundRequest = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const { booking_id, amount, reason } = req.body;
    if (!booking_id || !amount) {
      return res.status(400).json({ message: "booking_id and amount are required" });
    }

    const booking = await q("SELECT id, user_id FROM reservations WHERE id = ?", [booking_id]);
    if (!booking.length) return res.status(404).json({ message: "Booking not found" });

    const result = await q(
      "INSERT INTO booking_refunds (booking_id, user_id, reason, amount, status) VALUES (?, ?, ?, ?, 'requested')",
      [booking_id, booking[0].user_id, reason || "Deposit return - no damage found", amount]
    );

    res.status(201).json({ id: result.insertId, message: "Refund request created" });
  } catch (err) {
    console.error("createRefundRequest error:", err);
    res.status(500).json({ message: "Failed to create refund request" });
  }
};

exports.listRefunds = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const rows = await q(`
      SELECT br.*, r.reference, r.car_name, r.first_name, r.surname, r.email
      FROM booking_refunds br
      LEFT JOIN reservations r ON r.id = br.booking_id
      ORDER BY br.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("listRefunds error:", err);
    res.status(500).json({ message: "Failed to load refunds" });
  }
};

exports.updateRefundStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const { status, bank_reference } = req.body;
    const allowed = ["requested", "approved", "rejected", "paid"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await q(
      "UPDATE booking_refunds SET status = ?, processed_by = ?, bank_reference = ? WHERE id = ?",
      [status, req.user.id, bank_reference || null, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("updateRefundStatus error:", err);
    res.status(500).json({ message: "Failed to update refund" });
  }
};