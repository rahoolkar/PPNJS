const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/reviews.js")
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const myError = require("../utils/myError.js");
const {reviewschema} = require("../schema.js");
const {postReview,deleteReview} = require("../controllers/reviews.js");

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
router.delete("/:rid",isLoggedIn,isAllowed,wrapAsync(deleteReview));

//post route for the review 
router.post("/",isLoggedIn,validateReviews,wrapAsync(postReview));

module.exports = router;