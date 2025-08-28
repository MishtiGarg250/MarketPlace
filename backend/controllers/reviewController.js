const Review = require("../models/Review");


const Product = require("../models/Product");
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
    // Update product's average rating and review count
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviews: reviews.length
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