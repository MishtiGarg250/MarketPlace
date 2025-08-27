
const express = require("express");
const router = express.Router();
const {protect, authorize} = require("../middleware/auth");
const { getSellerAnalytics, getSellerOrders } = require("../controllers/sellerController");
const upload = require("../config/multer");
const{
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    markFeatured
} = require("../controllers/productController");

router.post("/upload", protect, authorize("seller"), (req, res, next) => {
    upload.single("image")(req, res, function (err) {
        if (err) {
            console.error("Multer/Cloudinary error:", err);
            return res.status(500).json({ error: err.message || err.toString() });
        }
        if (!req.file || !req.file.path) {
            return res.status(400).json({ msg: "No image uploaded" });
        }
        res.json({ url: req.file.path });
    });
});

router.get("/", getProducts);
router.post("/", protect, authorize("seller"), createProduct); 
router.put("/:id", protect, authorize("seller"), updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);
router.put("/:id/feature", protect, authorize("seller"), markFeatured);

router.get("/seller/:sellerId/analytics", getSellerAnalytics);
router.get("/seller/:sellerId/orders", getSellerOrders);

module.exports = router;