const express = require("express");
const router = express.Router();
const db = require("../config/database");

// ======================================================
// SUBMIT PARTNER REQUEST
// ======================================================

router.post("/request", async (req, res) => {
  try {
    const {
      company_name,
      brn,
      country,
      website_url,
      contact_person,
      business_email,
      phone_number,
      partnership_type,
      message,
    } = req.body;

    if (!company_name || !business_email) {
      return res.status(400).json({
        success: false,
        message: "Company name and business email are required",
      });
    }

    await db.execute(
      `
      INSERT INTO partner_requests
      (company_name, brn, country, website_url, contact_person, business_email, phone_number, partnership_type, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [company_name, brn || null, country || null, website_url || null, contact_person || null, business_email, phone_number || null, partnership_type || null, message || null]
    );

    res.json({ success: true, message: "Partner request submitted successfully" });
  } catch (err) {
    console.error("PARTNER REQUEST ERROR:", err);
    
    if (err.code === "ER_NO_SUCH_TABLE") {
      try {
        await db.execute(`
          CREATE TABLE IF NOT EXISTS partner_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            company_name VARCHAR(255) NOT NULL,
            brn VARCHAR(100),
            country VARCHAR(100),
            website_url VARCHAR(255),
            contact_person VARCHAR(255),
            business_email VARCHAR(255) NOT NULL,
            phone_number VARCHAR(50),
            partnership_type VARCHAR(100),
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'contacted', 'approved', 'rejected') DEFAULT 'pending'
          )
        `);
        
        await db.execute(
          `INSERT INTO partner_requests (company_name, brn, country, website_url, contact_person, business_email, phone_number, partnership_type, message, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [company_name, brn, country, website_url, contact_person, business_email, phone_number, partnership_type, message]
        );
        
        return res.json({ success: true, message: "Partner request submitted successfully" });
      } catch (createErr) {
        console.error("TABLE CREATE ERROR:", createErr);
      }
    }

    res.status(500).json({ success: false, message: "Server Error: " + err.message });
  }
});

// ======================================================
// GET ALL PARTNER REQUESTS (ADMIN)
// ======================================================

router.get("/requests", async (req, res) => {
  try {
    const [requests] = await db.execute(`SELECT * FROM partner_requests ORDER BY created_at DESC`);
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;