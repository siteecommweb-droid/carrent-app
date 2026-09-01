const express = require("express");
const router = express.Router();
const db = require("../config/database");

router.get("/trip-exports", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        export_type,
        shared_platform,
        COUNT(*) as total
      FROM trip_exports
      GROUP BY export_type, shared_platform
      ORDER BY total DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to load trip analytics",
    });
  }
});

router.get("/trip-exports-summary", async (req, res) => {
  try {
    const [summary] = await db.query(`
      SELECT
        COUNT(*) as total_exports,

        SUM(
          CASE
            WHEN export_type='pdf'
            THEN 1 ELSE 0
          END
        ) as pdf_exports,

        SUM(
          CASE
            WHEN export_type='png'
            THEN 1 ELSE 0
          END
        ) as png_exports,

        SUM(
          CASE
            WHEN shared_platform='whatsapp'
            THEN 1 ELSE 0
          END
        ) as whatsapp_shares

      FROM trip_exports
    `);

    res.json(summary[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to load export summary",
    });
  }
});

module.exports = router;