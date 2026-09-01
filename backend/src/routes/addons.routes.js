const express = require("express");
const router = express.Router();

const addons = [
  { id: "driver", name: "Private Driver", description: "Professional driver for your trip", price: 1500, category: "service" },
  { id: "sim", name: "Tourist SIM Card", description: "30GB data + local calls", price: 300, category: "connectivity" },
  { id: "vip", name: "VIP Package", description: "Priority pickup + champagne", price: 2500, category: "luxury" },
  { id: "child_seat", name: "Child Safety Seat", description: "For children 0-12 years", price: 200, category: "safety" },
  { id: "gps", name: "GPS Navigation", description: "Real-time traffic updates", price: 150, category: "tech" }
];

router.get("/", (req, res) => {
  const carId = req.query.carId;
  res.json(addons);
});

module.exports = router;