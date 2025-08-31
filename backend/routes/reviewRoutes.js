const express = require("express");
const { protect } = require("../middleware/auth");
const { addReview, getSellerReviews, getProductReviews } = require("../controllers/reviewController");

const router = express.Router();


router.post("/", protect, addReview); 

router.get("/seller/:sellerId", getSellerReviews); 

router.get("/product/:productId", getProductReviews); 

module.exports = router;
