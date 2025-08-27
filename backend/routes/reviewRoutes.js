const express = require("express");
const { protect } = require("../middleware/auth");
const { addReview, getSellerReviews, getProductReviews } = require("../controllers/reviewController");

const router = express.Router();


// Add review (now expects productId in body)
router.post("/", protect, addReview); 

// Get reviews by sellerId
router.get("/seller/:sellerId", getSellerReviews); 

// Get reviews by productId
router.get("/product/:productId", getProductReviews); 

module.exports = router;
