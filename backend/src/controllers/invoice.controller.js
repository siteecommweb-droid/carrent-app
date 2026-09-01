const PDFDocument = require("pdfkit");
let db;
try { db = require("../config/db"); } catch (e) { db = require("../config/database"); }
const rawPool = db.pool || db.default || db;
const pool = typeof rawPool.promise === "function" ? rawPool.promise() : rawPool;

const q = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return Array.isArray(result) ? result[0] : result;
};

// GET /api/invoices — admin sees all, customer sees only their own
exports.getInvoices = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const sql = isAdmin
      ? `SELECT id, reference AS invoice_number, first_name, surname, email AS customer_email,
                grand_total_mur AS total_amount, status, created_at, id AS booking_id
         FROM reservations ORDER BY created_at DESC LIMIT 500`
      : `SELECT id, reference AS invoice_number, first_name, surname, email AS customer_email,
                grand_total_mur AS total_amount, status, created_at, id AS booking_id
         FROM reservations WHERE user_id = ? ORDER BY created_at DESC`;
    const rows = await q(sql, isAdmin ? [] : [req.user.id]);
    const shaped = rows.map((r) => ({
      ...r,
      customer_name: `${r.first_name || ""} ${r.surname || ""}`.trim() || "Customer",
    }));
    res.json(shaped);
  } catch (err) {
    console.error("getInvoices error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/invoices/:id — updates the underlying reservation status
exports.updateInvoiceStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "paid", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });
    await q("UPDATE reservations SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error("updateInvoiceStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/invoices/:id/email — resends the confirmation email as an "invoice notice"
exports.sendInvoiceEmail = async (req, res) => {
  try {
    const rows = await q("SELECT * FROM reservations WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Invoice not found" });
    const r = rows[0];
    const { sendBookingConfirmation } = require("../services/email.service");
    await sendBookingConfirmation({
      email: r.email,
      customer: `${r.first_name || ""} ${r.surname || ""}`.trim() || "Customer",
      reference: r.reference,
      vehicle: r.car_name || "",
      total: r.grand_total_mur || 0,
    });
    res.json({ success: true, message: "Invoice email sent" });
  } catch (err) {
    console.error("sendInvoiceEmail error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/invoices/:id/pdf — real invoice PDF built from the actual reservation
exports.generateInvoicePdf = async (req, res) => {
  try {
    const rows = await q("SELECT * FROM reservations WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Invoice not found" });
    const r = rows[0];

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice-${r.reference}.pdf`);
    doc.pipe(res);

    doc.fontSize(24).fillColor("#e11d48").text("AM38 RENT A CAR", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor("#666").text("Mauritius Mobility", { align: "center" });
    doc.moveDown(1.5);

    doc.fontSize(16).fillColor("#000").text(`Invoice / Reference: ${r.reference}`);
    doc.fontSize(10).fillColor("#666").text(`Issued: ${new Date(r.created_at).toLocaleDateString()}`);
    doc.moveDown(1);

    doc.fontSize(12).fillColor("#000").text("Bill To:", { underline: true });
    doc.fontSize(11).text(`${r.first_name || ""} ${r.surname || ""}`.trim() || "Customer");
    doc.text(r.email || "");
    doc.text(r.phone || "");
    doc.moveDown(1);

    doc.fontSize(12).text("Booking Details:", { underline: true });
    doc.fontSize(11).text(`Vehicle: ${r.car_name || "N/A"} (${r.av_group || ""})`);
    doc.text(`Pickup: ${r.pickup_date || "N/A"} — Return: ${r.return_date || "N/A"}`);
    doc.text(`Days: ${r.days || 1}`);
    doc.text(`Status: ${(r.status || "pending").toUpperCase()}`);
    doc.moveDown(1);

    doc.fontSize(12).text("Charges:", { underline: true });
    doc.fontSize(11).text(`Base total: MUR ${Number(r.base_total_mur || 0).toLocaleString()}`);
    doc.text(`Extras total: MUR ${Number(r.extras_total_mur || 0).toLocaleString()}`);
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor("#e11d48").text(`Grand Total: MUR ${Number(r.grand_total_mur || 0).toLocaleString()}`, { underline: true });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("#999").text("Thank you for choosing AM38 Rent a Car.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("generateInvoicePdf error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};