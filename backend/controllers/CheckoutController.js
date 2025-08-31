const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");


exports.checkout = async(req,res)=>{
  try {
    const userId = req.user.id;
    console.log(`[CHECKOUT] Starting checkout for user: ${userId}`);
    
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

  
    const seed = process.env.ASSIGNMENT_SEED;
  
    let seedNumber = 0;
    for (let i = 0; i < seed.length; i++) {
      seedNumber += seed.charCodeAt(i);
    }
    
    
    const feePercentage = (seedNumber % 10) / 100;

    for (const item of cartItems) {
      const product = item.productId;
      if (!product) continue;

      if (product.quantity < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
      }

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


  const platformFee = Math.round(subtotal * feePercentage * 100) / 100;
  const total = subtotal + platformFee;

    const transaction = await Transaction.create({
      buyer: userId,
      items,
      subtotal,
      platformFee,
      total,
      status: "success"
    });
    await Cart.deleteMany({ userId });
    console.log(`[CHECKOUT] Transaction created: ${transaction._id}, Total: $${total}, Platform Fee: $${platformFee}`);
    
    res.status(200).json({ 
      msg: "Checkout successful", 
      transactionId: transaction._id,
      subtotal,
      platformFee,
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during checkout" });
  }
}