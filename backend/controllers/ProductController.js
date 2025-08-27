const Product = require("../models/Product")
const generateSKU = require("../utils/skuGenerator")

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.body;
        let images = [];
        // Accept images from req.body.images (Cloudinary URLs)
        if (req.body.images) {
            try {
                // If sent as JSON, parse if needed
                if (typeof req.body.images === 'string') {
                    images = JSON.parse(req.body.images);
                } else {
                    images = req.body.images;
                }
                // Enforce max 5 images
                if (Array.isArray(images) && images.length > 5) {
                    return res.status(400).json({ message: "You can upload up to 5 images per product." });
                }
            } catch (e) {
                images = [];
            }
        }
        // Accept images from file upload (legacy/local)
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                alt: file.originalname
            }));
        }
        const product = new Product({
            sellerId: req.user.id,
            name,
            description,
            category,
            price,
            quantity,
            SKU: generateSKU(name),
            images,
            createdByRole: req.user.role
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Allow filtering by sellerId
        const filter = {};
        if (req.query.sellerId) {
            filter.sellerId = req.query.sellerId;
        }

        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({ page, limit, products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.user.role === "seller" && product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Cannot edit this product" });
        }

        const { name, description, category, price, quantity } = req.body;

        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;
        if (price) product.price = price;
        if (quantity) product.quantity = quantity;

        
        if (name) product.SKU = generateSKU(name);

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                url: `/uploads/${file.filename}`,
                alt: file.originalname
            }));
        
            product.images = product.images.concat(newImages);
        }

        await product.save();
        res.json({message: "Product updated successfully", product });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Check if seller owns the product or admin
        if (req.user.role === "seller" && product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Cannot delete this product" });
        }

        await product.remove();
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const markFeatured = async(req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {isFeatured: true},
            {new:true}
        )
        res.json(product)
    }catch(err){
        res.status(500).json({msg:"Error marking product as featured"})
    }

}

module.exports = {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
    markFeatured
};