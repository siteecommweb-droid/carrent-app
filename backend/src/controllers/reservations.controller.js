const jwt = require("jsonwebtoken");
const { sendBookingConfirmation } = require("../services/email.service");

let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

function optionalUserId(req) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload?.id || null;
  } catch {
    return null;
  }
}

exports.createReservation = async (req, res) => {
  try {
    const b = req.body || {};
    const files = req.files || {};
    const reference = `AM38-R-${Date.now().toString().slice(-8)}`;
    const filePath = (k) => (files[k] && files[k][0] ? `/uploads/reservations/${files[k][0].filename}` : null);
    const userId = optionalUserId(req);

    const row = {
      reference,
      user_id: userId,
      car_id: b.car_id || null,
      car_name: b.car_name || "",
      av_group: b.av_group || "",
      model_guaranteed: b.model_guaranteed === "false" ? 0 : 1,
      pickup_location: b.pickup_location || "",
      dropoff_location: b.dropoff_location || "",
      pickup_date: b.pickup_date || null,
      return_date: b.return_date || null,
      days: Number(b.days || 1),
      title: b.title || "",
      first_name: b.first_name || "",
      surname: b.surname || "",
      email: b.email || "",
      phone: b.phone || "",
      date_of_birth: b.date_of_birth || null,
      nationality: b.nationality || "",
      country_of_residence: b.country_of_residence || "",
      home_address: b.home_address || "",
      passport_number: b.passport_number || "",
      id_number: b.id_number || "",
      licence_number: b.licence_number || "",
      licence_country: b.licence_country || "",
      passport_file: filePath("passport"),
      id_file: filePath("id_doc"),
      licence_file: filePath("licence"),
      flight_number: b.flight_number || "",
      accommodation_type: b.accommodation_type || "",
      accommodation_name: b.accommodation_name || "",
      accommodation_address: b.accommodation_address || "",
      accommodation_ref: b.accommodation_ref || "",
      stay_from: b.stay_from || null,
      stay_to: b.stay_to || null,
      stay_length_days: Number(b.stay_length_days || 0),
      adults: Number(b.adults || 1),
      children: Number(b.children || 0),
      infants: Number(b.infants || 0),
      luggage_large: Number(b.luggage_large || 0),
      luggage_small: Number(b.luggage_small || 0),
      purpose_of_visit: b.purpose_of_visit || "",
      special_request: b.special_request || "",
      extras_json: b.extras_json || "[]",
      base_total_mur: Number(b.base_total_mur || 0),
      extras_total_mur: Number(b.extras_total_mur || 0),
      grand_total_mur: Number(b.grand_total_mur || 0),
      grand_total_usd: Number(b.grand_total_usd || 0),
      status: "pending",
    };

    const columns = Object.keys(row);
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((c) => row[c]);

    const sql = `INSERT INTO reservations (${columns.join(", ")}) VALUES (${placeholders})`;
    const result = await q(sql, values);

    // ----- Booking confirmation email -----
    if (b.email) {
      sendBookingConfirmation({
        email: b.email,
        customer: `${b.first_name || ""} ${b.surname || ""}`.trim() || "Customer",
        reference,
        vehicle: b.car_name || "",
        total: b.grand_total_mur || 0,
      }).catch((e) => console.error("Confirmation email failed:", e.message));
    }

    // ----- Auto-create a support ticket for every new reservation -----
    let ticketSubject = `New Reservation ${reference} — ${b.car_name || "Car"}`;
    try {
      const ticketMessage =
        `A new reservation was created.\n` +
        `Reference: ${reference}\n` +
        `Car: ${b.car_name || "N/A"} (${b.av_group || "N/A"})\n` +
        `Pickup: ${b.pickup_date || "N/A"} -> Return: ${b.return_date || "N/A"}\n` +
        `Customer: ${b.first_name || ""} ${b.surname || ""}\n` +
        `Email: ${b.email || "N/A"}\n` +
        `Phone: ${b.phone || "N/A"}\n` +
        `Total: MUR ${b.grand_total_mur || 0}`;

      await q(
        `INSERT INTO tickets (user_id, booking_id, subject, message, status, priority, guest_name, guest_email, guest_phone)
         VALUES (?, ?, ?, ?, 'open', 'normal', ?, ?, ?)`,
        [
          userId,
          result.insertId,
          ticketSubject,
          ticketMessage,
          userId ? null : (`${b.first_name || ""} ${b.surname || ""}`.trim() || null),
          userId ? null : (b.email || null),
          userId ? null : (b.phone || null),
        ]
      );
    } catch (ticketErr) {
      console.error("Auto-ticket creation failed:", ticketErr.message);
    }

    // ----- 🔥 NEW: Emit socket events to admin room after reservation + ticket creation -----
    const io = req.app.get("io");
    if (io) {
      io.to("admin-room").emit("booking:update", { reference, car: b.car_name });
      io.to("admin-room").emit("ticket:refresh", { subject: ticketSubject });
    }

    res.status(201).json({ id: result.insertId, reference, message: "Reservation saved" });
  } catch (err) {
    console.error("createReservation error:", err);
    res.status(500).json({ message: "Failed to save reservation", error: err.message });
  }
};

exports.myReservations = async (req, res) => {
  try {
    const rows = await q("SELECT * FROM reservations WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error("myReservations error:", err);
    res.status(500).json({ message: "Failed to load your reservations" });
  }
};

exports.listReservations = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const rows = await q("SELECT * FROM reservations ORDER BY created_at DESC LIMIT 500");
    res.json(rows);
  } catch (err) {
    console.error("listReservations error:", err);
    res.status(500).json({ message: "Failed to load reservations" });
  }
};

exports.getReservation = async (req, res) => {
  try {
    const rows = await q("SELECT * FROM reservations WHERE id = ? OR reference = ? LIMIT 1", [req.params.id, req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to load reservation" });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const { status } = req.body;
    await q("UPDATE reservations SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};