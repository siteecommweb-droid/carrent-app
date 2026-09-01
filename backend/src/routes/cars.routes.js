const express = require("express");

const {
  getCars,
  getCar,
  generateFleet,
  updatePrice,
} = require("../controllers/cars.controller");

const router = express.Router();

// IMPORTANT ORDER

router.get("/", getCars);

router.get("/generate", generateFleet);

router.post("/generate", generateFleet);

router.put("/:id/price", updatePrice);

router.get("/:id", getCar);

module.exports = router;