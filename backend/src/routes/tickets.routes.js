const express = require("express");
const router = express.Router();
let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;
const auth = require("../middleware/auth.middleware");

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

router.get("/my", auth, async (req, res) => {
  try {
    const rows = await q(
      "SELECT id, subject, message, status, priority, created_at, updated_at FROM tickets WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id/messages", auth, async (req, res) => {
  try {
    const ticketCheck = await q("SELECT id FROM tickets WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    if (!ticketCheck.length) return res.status(403).json({ success: false, message: "Not your ticket" });

    const rows = await q("SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC", [req.params.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:id/messages", auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message required" });

    const ticketCheck = await q("SELECT id FROM tickets WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
    if (!ticketCheck.length) return res.status(403).json({ success: false, message: "Not your ticket" });

    await q(
      "INSERT INTO ticket_messages (ticket_id, user_id, sender_role, message) VALUES (?, ?, 'customer', ?)",
      [req.params.id, req.user.id, message]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { subject = "Support request", message, priority = "normal" } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });
    const result = await q(
      "INSERT INTO tickets (user_id, subject, message, status, priority) VALUES (?, ?, ?, 'open', ?)",
      [req.user.id, subject, message, priority]
    );
    res.json({ success: true, ticketId: result.insertId, message: "Ticket created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;