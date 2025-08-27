
const Favorite = require('../models/Favorite');


// Add product to favorites
exports.addFavorite = async (req, res) => {
	try {
		const userId = req.user.id;
		const { productId } = req.body;
		if (!productId) return res.status(400).json({ msg: 'Product ID required' });
		// Prevent duplicate
		const exists = await Favorite.findOne({ userId, productId });
		if (exists) return res.status(200).json({ msg: 'Already favorited' });
		await Favorite.create({ userId, productId });
		res.json({ msg: 'Product added to favorites' });
	} catch (err) {
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
};

// Remove product from favorites
exports.removeFavorite = async (req, res) => {
	try {
		const userId = req.user.id;
		const { productId } = req.body;
		if (!productId) return res.status(400).json({ msg: 'Product ID required' });
		await Favorite.deleteOne({ userId, productId });
		res.json({ msg: 'Product removed from favorites' });
	} catch (err) {
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
};

// Get all favorite products for the user
exports.getFavorites = async (req, res) => {
	try {
		const userId = req.user.id;
		const favorites = await Favorite.find({ userId }).populate('productId');
		// Return just the product details
		const products = favorites.map(fav => fav.productId);
		res.json({ favorites: products });
	} catch (err) {
		res.status(500).json({ msg: 'Server error', error: err.message });
	}
};
