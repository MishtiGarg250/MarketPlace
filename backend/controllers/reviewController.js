const Review = require("../models/Review");
const Product = require("../models/Product");

exports.addReview = async(req,res)=>{
  try {
    const { sellerId, productId, rating, comment } = req.body;
    const review = await Review.create({
      seller: sellerId,
      product: productId,
      buyer: req.user.id,
      rating,
      comment
    });

    // Always recalculate average rating from all reviews for this product
    const reviews = await Review.find({ product: productId });
    let avgRating = 0;
    if (reviews.length > 0) {
      avgRating = reviews.reduce((sum, r) => sum + (typeof r.rating === 'number' ? r.rating : 0), 0) / reviews.length;
      avgRating = Math.round(avgRating * 100) / 100; // keep up to two decimal places
    }
    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      reviews: reviews.length
    });
    res.status(200).json({ msg: "Review added successfully", review });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
}

exports.getSellerReviews = async(req,res)=>{
      try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate("buyer", "name");

    res.json(reviews);
    console.log(reviews)
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
}

// Get reviews by productId
exports.getProductReviews = async (req, res) => {
  const mongoose = require("mongoose");
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid productId" });
    }
    console.log(productId);
    const reviews = await Review.find({ product: productId })
      .populate("buyer", "name avatar");
      console.log(reviews)
    res.json(reviews);
  } catch (err) {
    console.error("Error in getProductReviews:", err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
}
