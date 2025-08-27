const Review = require("../models/Review");


exports.addReview = async(req,res)=>{
    try{
        const {sellerId, productId, rating, comment} = req.body;
        const review = await Review.create({
            seller: sellerId,
            product: productId,
            buyer: req.user.id,
            rating,
            comment
        });
        res.status(200).json({msg:"Review added successfully", review});
    }catch(err){
        console.log(err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
}

exports.getSellerReviews = async(req,res)=>{
      try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate("buyer", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
}

// Get reviews by productId
exports.getProductReviews = async(req,res)=>{
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("buyer", "name avatar");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
}