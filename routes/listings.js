const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const myError = require("../utils/myError.js");
const {listingschema} = require("../schema.js");
const Listing = require("../models/listings.js");


//middleware for the post and edit route 
const validateListings = (req,res,next)=>{
    let data = req.body;
    let result = listingschema.validate(data);
    if(result.error){
        throw new myError(400,result.error);
    }else{
        next();
    }
}

const isLoggedIn = function(req,res,next){
    if(!req.isAuthenticated()){
        req.session.lastUrl = req.originalUrl;
        req.flash("error","Please log in first");
        res.redirect("/login");
    }else{
        next();
    }
}

//middleware for authentication
const isAllowed = async function(req,res,next){
    let {id} = req.params ;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error","You are not permitted to do this. Sorry :(");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//index route
router.get("/",wrapAsync(async(req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/index.ejs",{listings});
}))

//new route 
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
})

//edit route
router.get("/:id/edit",isLoggedIn,isAllowed,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exists :(");
        req.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}))

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing not found :(")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}))

//update route
router.put("/:id",isLoggedIn,isAllowed,validateListings,wrapAsync(async(req,res)=>{
    let {id} = req.params ;
    let data = req.body;
    await Listing.findByIdAndUpdate(id,data);
    req.flash("success","Listing edited!")
    res.redirect(`/listings/${id}`);
}))

//post route
router.post("/",isLoggedIn,validateListings,wrapAsync(async(req,res,next)=>{
    let data = req.body;
    let newdata = new Listing(data);
    newdata.owner = req.user._id;
    await newdata.save()
    req.flash("success","New Listing created !")
    res.redirect("/listings"); 
}))

//delete route
router.delete("/:id",isLoggedIn,isAllowed,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}))

module.exports = router;