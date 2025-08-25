const express = require("express");
const { protect } = require("../middleware/auth");
const { addReview, getSellerReviews } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", protect, addReview); 
router.get("/:sellerId", getSellerReviews); 

module.exports = router;
