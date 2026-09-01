let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const { sendOTP } = require("../services/twilio.service");

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

exports.sendCode = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 6) {
      return res.status(400).json({ success: false, message: "Valid phone number required" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await q("DELETE FROM otp_codes WHERE phone = ?", [phone]);
    await q(
      "INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))",
      [phone, code]
    );

    const result = await sendOTP(phone, code);

    res.json({
      success: true,
      message: result.simulated ? "OTP generated (dev mode, no real SMS sent)" : "OTP sent via SMS",
      devCode: result.simulated ? code : undefined,
    });
  } catch (err) {
    console.error("sendCode error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ success: false, message: "Phone and code required" });
    }

    const rows = await q(
      "SELECT id FROM otp_codes WHERE phone = ? AND code = ? AND expires_at > NOW() LIMIT 1",
      [phone, code]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, message: "Invalid or expired code" });
    }

    await q("DELETE FROM otp_codes WHERE id = ?", [rows[0].id]);
    res.json({ success: true, message: "Phone verified" });
  } catch (err) {
    console.error("verifyCode error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};