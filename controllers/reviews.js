const Listing = require("../models/listings");
const Review = require("../models/reviews");

module.exports.deleteReview = async(req,res)=>{
    let {id,rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id,{ $pull : {reviews : rid} });
    req.flash("success","Review deleted !");
    res.redirect(`/listings/${id}`);
}

module.exports.postReview = async (req,res)=>{
    let data = req.body;
    let {id} = req.params;
    let newReview = new Review(data);
    newReview.author = req.user._id;
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review posted !")
    res.redirect(`/listings/${id}`);
}