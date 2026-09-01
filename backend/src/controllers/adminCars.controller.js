let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

exports.getCars = async (req, res) => {
  try {
    const cars = await q("SELECT * FROM cars ORDER BY id ASC");
    res.json({ success: true, count: cars.length, cars });
  } catch (err) {
    console.error("adminCars.getCars error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCar = async (req, res) => {
  try {
    const cars = await q("SELECT * FROM cars WHERE id = ? LIMIT 1", [req.params.id]);
    if (!cars.length) return res.status(404).json({ success: false, message: "Car not found" });
    res.json({ success: true, car: cars[0] });
  } catch (err) {
    console.error("adminCars.getCar error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCar = async (req, res) => {
  try {
    const b = req.body || {};
    const result = await q(
      `INSERT INTO cars (brand, model, year, price_per_day, image, transmission, fuel_type, seats, av_group, color, stock_number, wow_feature, category, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.brand || "Suzuki", b.model || "Swift", b.year || 2025, b.price_per_day || 1500,
        b.image || "/cars/swift.jpg", b.transmission || "Automatic", b.fuel_type || "Petrol",
        b.seats || 5, b.av_group || "EDAV", b.color || "White",
        b.stock_number || `AM38-${Date.now()}`, b.wow_feature || "", b.category || "Standard",
        b.available === false ? 0 : 1,
      ]
    );
    const rows = await q("SELECT * FROM cars WHERE id = ?", [result.insertId]);
    res.status(201).json({ success: true, car: rows[0] });
  } catch (err) {
    console.error("adminCars.createCar error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const b = req.body || {};
    const allowed = ["brand", "model", "year", "price_per_day", "image", "transmission", "fuel_type", "seats", "av_group", "color", "stock_number", "wow_feature", "category", "available"];
    const fields = [];
    const params = [];
    for (const key of allowed) {
      if (b[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(key === "available" ? (b[key] ? 1 : 0) : b[key]);
      }
    }
    if (!fields.length) return res.status(400).json({ success: false, message: "Nothing to update" });
    params.push(req.params.id);
    await q(`UPDATE cars SET ${fields.join(", ")} WHERE id = ?`, params);
    const rows = await q("SELECT * FROM cars WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Car not found" });
    res.json({ success: true, car: rows[0] });
  } catch (err) {
    console.error("adminCars.updateCar error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const result = await q("DELETE FROM cars WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Car not found" });
    res.json({ success: true, message: "Car deleted" });
  } catch (err) {
    console.error("adminCars.deleteCar error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};