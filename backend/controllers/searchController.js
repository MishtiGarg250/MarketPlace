const Product = require('../models/Product');

exports.searchProducts = async (req, res) => {
  try {
    let {
      name,
      category,
      location,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Search by product name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by location
    if (location) {
      query.location = location;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting logic
    let sortOptions = {};
    if (sortBy === "price_asc") sortOptions.price = 1;
    else if (sortBy === "price_desc") sortOptions.price = -1;
    else if (sortBy === "latest") sortOptions.createdAt = -1;
    else if (sortBy === "rating") sortOptions.rating = -1;

    // Pagination
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

