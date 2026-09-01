const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, full_name, email, password, phone } = req.body;
    const fn = first_name || (full_name ? full_name.split(" ")[0] : "");
    const ln = last_name || (full_name ? full_name.split(" ").slice(1).join(" ") : "");

    if ((!fn && !full_name) || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existing = await q("SELECT id FROM app_users WHERE email = ? LIMIT 1", [email]);
    if (existing.length) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await q(
      "INSERT INTO app_users (email, password, role, first_name, last_name, phone, oauth_provider) VALUES (?, ?, 'user', ?, ?, ?, 'local')",
      [email, hashed, fn, ln, phone || null]
    );

    const rows = await q("SELECT id, email, role, first_name, last_name FROM app_users WHERE id = ?", [result.insertId]);
    const user = rows[0];
    const token = createToken(user);

    return res.json({ success: true, token, user });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const rows = await q("SELECT id, email, role, first_name, last_name, password FROM app_users WHERE email = ? LIMIT 1", [email]);
    const user = rows[0];
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user);
    return res.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const rows = await q("SELECT id, email, role, first_name, last_name, phone FROM app_users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.googleCallback = async (req, res) => {
  const token = createToken(req.user);
  res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth-success?token=${token}`);
};

// ============================================================
// FORGOT PASSWORD
// ============================================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const rows = await q("SELECT id FROM app_users WHERE email = ? LIMIT 1", [email]);
    if (!rows.length) {
      return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = jwt.sign({ id: rows[0].id, purpose: "reset" }, process.env.JWT_SECRET, { expiresIn: "30m" });
    const { sendPasswordResetEmail } = require("../services/email.service");
    await sendPasswordResetEmail(email, resetToken);

    return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ success: false, message: "Reset link expired or invalid" });
    }
    if (decoded.purpose !== "reset") {
      return res.status(400).json({ success: false, message: "Invalid reset token" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await q("UPDATE app_users SET password = ? WHERE id = ?", [hashed, decoded.id]);

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================================
// PHONE OTP LOGIN / REGISTER
// ============================================================
exports.phoneLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    const rows = await q("SELECT id, email, role, first_name, last_name, phone FROM app_users WHERE phone = ? LIMIT 1", [phone]);
    let user = rows[0];

    if (!user) {
      const result = await q(
        "INSERT INTO app_users (phone, role, first_name, oauth_provider) VALUES (?, 'user', 'Guest', 'phone')",
        [phone]
      );
      const newRows = await q("SELECT id, email, role, first_name, last_name, phone FROM app_users WHERE id = ?", [result.insertId]);
      user = newRows[0];
    }

    const token = createToken(user);
    return res.json({ success: true, token, user });
  } catch (err) {
    console.error("phoneLogin error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};