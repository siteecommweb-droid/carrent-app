let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

function makeReference() {
  return `AM38-${Date.now()}`;
}

exports.createBooking = async (req, res) => {
  try {
    const b = req.body || {};
    const carId = b.car_id;
    const pickupDate = b.pickup_date || b.start_date || null;
    const returnDate = b.return_date || b.end_date || null;

    if (!carId) return res.status(400).json({ success: false, message: "car_id is required" });
    if (!pickupDate || !returnDate) return res.status(400).json({ success: false, message: "Pickup and return dates are required" });

    const reference = makeReference();
    const fullName = b.customer_name || b.fullName || "Customer";
    const [firstName, ...rest] = fullName.split(" ");

    const result = await q(
      `INSERT INTO reservations (reference, user_id, car_id, first_name, surname, email, phone, pickup_location, dropoff_location, pickup_date, return_date, grand_total_mur, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        reference, req.user?.id || null, carId, firstName || "", rest.join(" ") || "",
        b.customer_email || b.email || req.user?.email || "", b.customer_phone || b.phone || "",
        b.pickup_location || "SSR International Airport", b.dropoff_location || b.pickup_location || "SSR International Airport",
        pickupDate, returnDate, Number(b.total_amount || b.grand_total || 0),
      ]
    );

    res.json({ success: true, bookingId: result.insertId, id: result.insertId, reference, message: "Booking created successfully" });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const rows = await q(
      `SELECT r.*, r.reference AS booking_reference, r.pickup_date AS start_datetime, r.return_date AS end_datetime,
              c.brand AS car_make, c.model AS car_model
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.id
       WHERE r.user_id = ? ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const rows = await q(
      `SELECT r.*, r.reference AS booking_reference, r.pickup_date AS start_datetime, r.return_date AS end_datetime,
              c.brand AS car_make, c.model AS car_model
       FROM reservations r
       LEFT JOIN cars c ON r.car_id = c.id
       WHERE r.id = ? AND r.user_id = ? LIMIT 1`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    await q("UPDATE reservations SET status = 'cancelled' WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};