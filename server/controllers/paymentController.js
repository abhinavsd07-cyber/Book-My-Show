const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @POST /api/payment/intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses paise (smallest currency unit)
      currency: "inr",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPaymentIntent };
