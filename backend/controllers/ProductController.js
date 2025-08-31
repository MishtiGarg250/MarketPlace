const Product = require("../models/Product")
const generateSKU = require("../utils/skuGenerator")

const createProduct = async (req, res) => {
    try {
    const { name, description, price, category, quantity, features } = req.body;
        let images = [];
        
        if (req.body.images) {
            try {
            
                if (typeof req.body.images === 'string') {
                    images = JSON.parse(req.body.images);
                } else {
                    images = req.body.images;
                }
                
                if (Array.isArray(images) && images.length > 5) {
                    return res.status(400).json({ message: "You can upload up to 5 images per product." });
                }
            } catch (e) {
                images = [];
            }
        }
        
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
            features: Array.isArray(features) ? features : (typeof features === 'string' ? JSON.parse(features) : []),
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
    
    if (req.query.id) {
      const product = await Product.findById(req.query.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json({ product });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    
    if (req.query.sellerId) {
      filter.sellerId = req.query.sellerId;
    }

    if (req.query.location) {
      const sellerUsers = await require("../models/User")
        .find({ location: req.query.location })
        .select("_id");
      const sellerIds = sellerUsers.map(u => u._id);
      filter.sellerId = { $in: sellerIds };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }


    if (req.query.excludeId) {
      filter._id = { $ne: req.query.excludeId };
    }

    // Filter by featured status
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
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

        if (req.user.role === "seller" && product.sellerId.toString() !== req.user.id) {
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

        
        if (req.user.role === "seller" && product.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Cannot delete this product" });
        }

    await Product.deleteOne({ _id: productId });
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const toggleFeatured = async(req,res)=>{
    try{
        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Only allow seller to toggle their own products
        if (req.user.role === "seller" && product.sellerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden: Cannot modify this product" });
        }
        
        // Toggle featured status
        product.isFeatured = !product.isFeatured;
        await product.save();
        
        res.json({ 
            message: `Product ${product.isFeatured ? 'marked as featured' : 'removed from featured'}`,
            product 
        });
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Error toggling featured status"})
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
    toggleFeatured
};