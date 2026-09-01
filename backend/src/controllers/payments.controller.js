const {
  createPaymentIntent,
} = require(
  "../services/stripe.service"
);

exports.createIntent =
  async (req, res) => {

    try {

      const {
        amount,
      } = req.body;

      const paymentIntent =
        await createPaymentIntent({
          amount,
        });

      res.json({
        clientSecret:
          paymentIntent.client_secret,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };