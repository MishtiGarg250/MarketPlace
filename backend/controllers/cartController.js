const Cart = require("../models/Cart");
const Product = require("../models/Product");


exports.addToCart = async(req,res)=>{
    try{
        const {productId, quantity} = req.body;
        if(!product) return res.status(404).json({msg:"Product not found"});
        let cartItem = await Cart.findOne({userId:req.user._id, productId});
        if(cartItem){
            cartItem.quantity += quantity || 1;
      await cartItem.save();
        }else{
                  cartItem = await Cart.create({
        userId: req.user._id,
        productId,
        quantity: quantity || 1,
      });

        }
        res.status(201).json(cartItem);
    }catch(err){
        console.log(err);
        res.status(500).json({msg:"Internal server error"});
    }
}

exports.getCart = async(req,res)=>{
     try {
    const cart = await Cart.find({ userId: req.user._id })
      .populate("productId", "name price images");

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

exports.updateCartItem = async(req,res)=>{
    try {
    const { quantity } = req.body;

    let cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ msg: "Cart item not found" });

    if (cartItem.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

exports.removeCartItem = async(req,res)=>{
    try{
        const cartItem = await Cart.findById(req.params.id);
        if(!cartItem) return res.status(404).json({masg:"Cart item not found"});

        if (cartItem.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await cartItem.deleteOne();
    res.status(200).json({msg:"Cart item removed"});
    }catch(err){
        res.status(500).json({msg:"Server error"});
    }
}