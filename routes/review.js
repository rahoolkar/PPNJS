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

//middleware for the the post route
const isLoggedIn = function(req,res,next){
    if(!req.isAuthenticated()){
        req.session.lastUrl = req.originalUrl;
        req.flash("error","Please log in first :(");
        return res.redirect("/login");
    }
    next();
}

//middleware for the delete route
const isAllowed = async function(req,res,next){
    let {id,rid} = req.params;
    let review = await Review.findById(rid);
    if(!req.user._id.equals(review.author._id)){
        req.flash("error","You are not permitted to do this. Sorry :(")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//delete request for the review
router.delete("/:rid",isLoggedIn,isAllowed,wrapAsync(async(req,res)=>{
    let {id,rid} = req.params;
    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(id,{ $pull : {reviews : rid} });
    req.flash("success","Review deleted !");
    res.redirect(`/listings/${id}`);
}))

//post route for the review 
router.post("/",wrapAsync(async (req,res)=>{
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
}))

module.exports = router;