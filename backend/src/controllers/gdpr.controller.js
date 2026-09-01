const jwt = require("jsonwebtoken");

let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

function optionalUser(req) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

exports.requestDeletion = async (req, res) => {
  try {
    const user = optionalUser(req);
    const { email, full_name, reason } = req.body || {};
    const finalEmail = email || user?.email;

    if (!finalEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    await q(
      `INSERT INTO deletion_requests (user_id, email, full_name, reason) VALUES (?, ?, ?, ?)`,
      [user?.id || null, finalEmail, full_name || null, reason || null]
    );

    res.status(201).json({
      message: "Your deletion request has been received. Our data protection officer will process it within 30 days.",
    });
  } catch (err) {
    console.error("requestDeletion error:", err);
    res.status(500).json({ message: "Failed to submit deletion request" });
  }
};