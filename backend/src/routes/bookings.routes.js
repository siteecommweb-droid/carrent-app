const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookings.controller");

router.post("/", auth, createBooking);
router.get("/", auth, getMyBookings);
router.get("/:id", auth, getBookingById);
router.put("/:id/cancel", auth, cancelBooking);

module.exports = router;