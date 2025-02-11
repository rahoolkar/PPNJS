const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/reviews.js")
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const myError = require("../utils/myError.js");
const {reviewschema} = require("../schema.js");


//Reviews
//middleware for the post route for the review
let validateReviews = (req,res,next)=>{
    let data = req.body;
    let ans = reviewschema.validate(data);
    if(ans.error){
        throw new myError(400,ans.error);
    }else{
        next();
    }
}

//delete request for the review
router.delete("/:rid",wrapAsync(async(req,res)=>{
    let {lid,rid} = req.params;

    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(lid,{ $pull : {reviews : rid} });
    res.redirect(`/listings/${lid}`);
}))

//post route for the review 
router.post("/",validateReviews,wrapAsync(async (req,res)=>{
    let data = req.body;
    let {id} = req.params;
    let newReview = new Review(data);
    let listing = await Listing.findById(id);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}))

module.exports = router;