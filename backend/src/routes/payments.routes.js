const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {}
  next();
}

router.post("/create-intent", optionalAuth, async (req, res) => {
  try {
    const { amount, bookingId, currency = "mur" } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ success: false, message: "Stripe secret key missing on server" });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: currency.toLowerCase(),
      metadata: {
        bookingId: bookingId ? String(bookingId) : "",
        userId: req.user ? String(req.user.id) : "guest",
      },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe create-intent error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;