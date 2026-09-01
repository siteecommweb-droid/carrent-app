const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_missing");

async function createPaymentIntent({
  amount,
  currency = "mur",
  metadata = {},
}) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("your_real_key")) {
    throw new Error("Stripe secret key is missing or invalid");
  }

  return stripe.paymentIntents.create({
    amount: Math.round(Number(amount)),
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
    metadata,
  });
}

async function refundPayment(paymentIntentId, amount) {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("your_real_key")) {
    throw new Error("Stripe secret key is missing or invalid");
  }

  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(Number(amount)) : undefined,
  });
}

module.exports = {
  stripe,
  createPaymentIntent,
  refundPayment,
};