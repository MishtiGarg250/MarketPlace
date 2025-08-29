const Transaction = require("../models/Transaction");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.mockComplete = async (req, res) => {
  try {
    const userId = req.user.id;
    // Prevent duplicate transactions within 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const recentTx = await Transaction.findOne({
      buyer: userId,
      createdAt: { $gte: thirtySecondsAgo }
    });
    if (recentTx) {
      return res.status(429).json({ msg: "Duplicate checkout detected. Please wait a moment before trying again." });
    }
    const cartItems = await Cart.find({ userId }).populate("productId");
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ msg: "Your cart is empty" });
    }
    let subtotal = 0;
    let items = [];
    for (const item of cartItems) {
      const product = item.productId;
      if (!product) continue;
      if (product.quantity < item.quantity) continue;
      product.quantity -= item.quantity;
      await product.save();
      subtotal += product.price * item.quantity;
      items.push({
        productId: product._id,
        seller: product.sellerId,
        quantity: item.quantity,
        price: product.price
      });
    }
    const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
    const total = subtotal + platformFee;
    await Transaction.create({
      buyer: userId,
      items,
      subtotal,
      platformFee,
      total,
      status: 'success'
    });
    await Cart.deleteMany({ userId });
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
        unit_amount: Math.round(item.productId.price * 100),
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
