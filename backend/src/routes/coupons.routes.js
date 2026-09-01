const express = require("express");
const router = express.Router();

const validCoupons = {
  "WELCOME10": { discount: 10, valid: true },
  "AM38FIRST": { discount: 15, valid: true },
  "WEEKLY20": { discount: 20, valid: true }
};

router.get("/validate", (req, res) => {
  const code = req.query.code?.toUpperCase();
  const coupon = validCoupons[code];
  if (coupon && coupon.valid) res.json({ valid: true, discount: coupon.discount });
  else res.json({ valid: false, message: "Invalid or expired coupon code" });
});

module.exports = router;