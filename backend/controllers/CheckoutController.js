
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");


exports.checkout = async(req,res)=>{
  try {
    const userId = req.user.id;
    const cartItems = await Cart.find({ userId }).populate("productId");
    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ msg: "Your cart is empty" });
    }
    let subtotal = 0;
    let items = [];

    
    const seed = process.env.ASSIGNMENT_SEED || "0";
    
    let n = 0;
    for (let i = 0; i < seed.length; i++) {
      if (!isNaN(Number(seed[i]))) n += Number(seed[i]);
      else n += seed.charCodeAt(i);
    }

    for (const item of cartItems) {
      const product = item.productId;
      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      subtotal += product.price * item.quantity;
      items.push({
        productId: product._id,
        seller: product.sellerId,
        quantity: item.quantity,
        price: product.price
      });
    }


  const platformFee = Math.floor(0.017 * subtotal + n);
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

    const responseBody = {
      msg: "Checkout successful",
      transaction
    };
    
    res.status(201).json(responseBody);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during checkout" });
  }
}