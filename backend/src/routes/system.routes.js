const express = require("express");
const router = express.Router();

router.get("/status", async (req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: "online"
  });
});

router.get("/exchange-rates", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/MUR"
    );

    const data = await response.json();

    res.json({
      base: data.base,
      rates: data.rates,
      updated: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch exchange rates"
    });
  }
});

router.get("/fuel-prices", async (req, res) => {
  res.json({
    petrol: 65.50,
    diesel: 49.80,
    lastUpdate: new Date().toISOString()
  });
});

module.exports = router;