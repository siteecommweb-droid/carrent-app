let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, q: search } = req.query;
    let sql = "SELECT * FROM tickets WHERE 1=1";
    const params = [];
    if (status) { sql += " AND status = ?"; params.push(status); }
    if (priority) { sql += " AND priority = ?"; params.push(priority); }
    if (search) { sql += " AND (subject LIKE ? OR guest_name LIKE ? OR guest_email LIKE ?)"; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    sql += " ORDER BY created_at DESC LIMIT 200";
    const rows = await q(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("getAllTickets error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const rows = await q("SELECT * FROM tickets WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Ticket not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("getTicketById error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const b = req.body || {};
    const result = await q(
      `INSERT INTO tickets (user_id, booking_id, subject, message, status, priority, guest_name, guest_email, guest_phone)
       VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?)`,
      [req.user?.id || null, b.booking_id || null, b.title || b.subject || "Support request", b.description || b.message || "", b.priority || "normal", b.customer_name || null, b.customer_email || null, b.customer_phone || null]
    );
    res.status(201).json({ id: result.insertId, message: "Ticket created" });
  } catch (err) {
    console.error("createTicket error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { status, priority } = req.body;
    const fields = [];
    const params = [];
    if (status) { fields.push("status = ?"); params.push(status); }
    if (priority) { fields.push("priority = ?"); params.push(priority); }
    if (!fields.length) return res.status(400).json({ message: "Nothing to update" });
    params.push(req.params.id);
    await q(`UPDATE tickets SET ${fields.join(", ")} WHERE id = ?`, params);
    res.json({ success: true });
  } catch (err) {
    console.error("updateTicketStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ========== CORRECTED: uses sender_role (not is_admin) ==========
exports.getTicketMessages = async (req, res) => {
  try {
    const rows = await q("SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC", [req.params.id]);
    res.json(rows);
  } catch (err) {
    console.error("getTicketMessages error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { message } = req.body;
    const senderRole = req.user?.role === "admin" ? "admin" : "customer";
    await q(
      "INSERT INTO ticket_messages (ticket_id, user_id, sender_role, message) VALUES (?, ?, ?, ?)",
      [req.params.id, req.user?.id || null, senderRole, message]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("addReply error:", err);
    res.status(500).json({ message: err.message });
  }
};
// ================================================================