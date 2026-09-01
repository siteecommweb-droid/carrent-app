let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

exports.getInbox = async (req, res) => {
  try {
    const emails = await q("SELECT * FROM email_inbox ORDER BY created_at DESC");
    res.json(emails);
  } catch (err) {
    console.error("getInbox error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.ingestEmail = async (req, res) => {
  try {
    const b = req.body || {};
    const result = await q(
      "INSERT INTO email_inbox (source, sender_name, sender_email, subject, raw_text, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [b.source || "manual", b.sender_name || null, b.sender_email || null, b.subject || "", b.raw_text || ""]
    );
    res.status(201).json({ id: result.insertId, message: "Email ingested" });
  } catch (err) {
    console.error("ingestEmail error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.parseEmail = async (req, res) => {
  try {
    const parsed = JSON.stringify({ intent: "booking", note: "Manual review needed" });
    await q("UPDATE email_inbox SET status = 'processed', parsed_json = ? WHERE id = ?", [parsed, req.params.id]);
    res.json({ success: true, message: "Email parsed" });
  } catch (err) {
    console.error("parseEmail error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.createTicketFromEmail = async (req, res) => {
  try {
    const emails = await q("SELECT * FROM email_inbox WHERE id = ?", [req.params.id]);
    if (!emails.length) return res.status(404).json({ message: "Email not found" });
    const e = emails[0];

    const ticketResult = await q(
      `INSERT INTO tickets (subject, message, status, priority, guest_name, guest_email)
       VALUES (?, ?, 'open', 'normal', ?, ?)`,
      [e.subject || "Email ticket", e.raw_text || "", e.sender_name || null, e.sender_email || null]
    );

    await q("UPDATE email_inbox SET linked_ticket_id = ?, status = 'ticket_created' WHERE id = ?", [ticketResult.insertId, req.params.id]);
    res.json({ success: true, ticketId: ticketResult.insertId, message: "Ticket created from email" });
  } catch (err) {
    console.error("createTicketFromEmail error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.createBookingFromEmail = async (req, res) => {
  try {
    const emails = await q("SELECT * FROM email_inbox WHERE id = ?", [req.params.id]);
    if (!emails.length) return res.status(404).json({ message: "Email not found" });
    const e = emails[0];
    const { car_id } = req.body || {};

    const carRows = car_id ? await q("SELECT car_name FROM cars WHERE id = ?", [car_id]).catch(() => []) : [];
    const reference = `AM38-E-${Date.now().toString().slice(-8)}`;

    const result = await q(
      `INSERT INTO reservations (reference, car_id, car_name, first_name, email, status, pickup_date, return_date)
       VALUES (?, ?, ?, ?, ?, 'pending', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY))`,
      [reference, car_id || null, carRows[0]?.model || "Unassigned", e.sender_name || "Email lead", e.sender_email || ""]
    );

    await q("UPDATE email_inbox SET linked_booking_id = ?, status = 'booking_created' WHERE id = ?", [result.insertId, req.params.id]);
    res.json({ success: true, bookingId: result.insertId, reference, message: "Booking created from email" });
  } catch (err) {
    console.error("createBookingFromEmail error:", err);
    res.status(500).json({ message: err.message });
  }
};