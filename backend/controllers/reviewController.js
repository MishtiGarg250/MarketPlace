const Review = require("../models/Review");

exports.addReview = async(req,res)=>{
    try{
        const {sellerId,rating,comment} = req.body;
        const review = await Reviewcreate({
            seller: sellerId,
            buyer: req.user.id,
            rating,
            comment
        })
        res.status(200).json({msg:"Review added successfully", review});
    }catch(err){
        console.log(err);
        res.status(500).json({ msg: "Server Error", error: err.message });

    }
}

exports.getSellerReviews = async(req,res)=>{
      try {
    const reviews = await Review.find({ seller: req.params.sellerId })
      .populate("buyer", "name");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
}