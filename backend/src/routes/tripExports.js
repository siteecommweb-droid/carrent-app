const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.post("/track-export", async (req, res) => {
  try {
    const {
      user_id,
      trip_id,
      export_type,
      shared_platform,
      export_title,
      export_description,
      device_info,
      browser_info,
    } = req.body;

    await db.query(
      `
      INSERT INTO trip_exports
      (
        user_id,
        trip_id,
        export_type,
        shared_platform,
        export_title,
        export_description,
        ip_address,
        device_info,
        browser_info
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id || null,
        trip_id || null,
        export_type,
        shared_platform || null,
        export_title || null,
        export_description || null,
        req.ip,
        device_info || null,
        browser_info || null,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;