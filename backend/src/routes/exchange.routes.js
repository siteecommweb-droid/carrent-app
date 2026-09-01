const express = require("express");
const router = express.Router();

// Mock exchange rates - replace with real API like OpenExchangeRates
const rates = {
  MUR: 1, USD: 0.022, EUR: 0.020, GBP: 0.017, INR: 1.83,
  ZAR: 0.42, AED: 0.081, CNY: 0.16, JPY: 3.30, CAD: 0.030,
  AUD: 0.033, CHF: 0.019, SEK: 0.23, NOK: 0.24, DKK: 0.15
};

router.get("/", (req, res) => {
  res.json({ rates, lastUpdate: new Date().toISOString() });
});

module.exports = router;