
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cart");



exports.mockComplete = async (req, res) => {
  try {
    res.status(200).json({ msg: "Checkout completed and cart cleared." });
  } catch (err) {
    console.error('Error in mockComplete:', err);
    res.status(500).json({ error: 'Mock completion error' });
  }
};

exports.createStripeSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ userId }).populate("productId");
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ msg: "Your cart is empty" });
    }
    
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productId.name,
          images: item.productId.images?.map(img => img.url) || [],
        },
        unit_amount: Math.round(item.productId.price*feePercentage * 100),
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: { userId },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Stripe session error" });
  }
};
