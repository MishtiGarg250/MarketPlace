const { getSellerProfile, updateSellerProfile, getSellerReviews } = require("../controllers/sellerController");


const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { getProfile } = require("../controllers/userController");
const favoriteController = require("../controllers/favoriteController");
// Favorite products
router.post("/favorites/add", protect, favoriteController.addFavorite);
router.post("/favorites/remove", protect, favoriteController.removeFavorite);
router.get("/favorites", protect, favoriteController.getFavorites);
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getProfile);
// Seller profile endpoints
router.get("/seller/:sellerId", getSellerProfile);
router.put("/seller/:sellerId", protect, authorize("seller", "admin"), updateSellerProfile);
router.get("/seller/:sellerId/reviews", getSellerReviews);

module.exports = router;
