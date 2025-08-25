const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.checkout = async(req,res)=>{
    try{
        const userId = req.user.id;
        const cartItems= await Cart.find({userId}).populate("productId");
        if(!cartItems || cartItems.length === 0){
            return res.status(404).json({msg:"Your cart is empty"})
        }
        let totalAmount = 0;
        let products= [];

         for (const item of cartItems) {
      const product = item.productId;
      if (!product) continue;

      if (product.stock < item.quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      products.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });


       const transaction = await Transaction.create({
      buyer: userId,
      products,
      totalAmount,
      status: "completed"
    });

    await Cart.deleteMany({ userId });

    res.status(201).json({
      msg: "Checkout successful",
      transaction
    });

    }}catch(err){
    console.error(err);
    res.status(500).json({msg:"Server error during checkout"})
    }
}