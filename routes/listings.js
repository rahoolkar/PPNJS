const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const myError = require("../utils/myError.js");
const {listingschema} = require("../schema.js");
const Listing = require("../models/listings.js");
const {index,renderNewForm,showListings,postListings,editListings,updateListings,deleteListings} = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

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

//middleware for authentication
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

//router.route code version
//router.route("/").get(wrapAsync(index)).post(isLoggedIn,validateListings,wrapAsync(postListings));

//index route
router.get("/",wrapAsync(index));

//new route 
router.get("/new",isLoggedIn,renderNewForm);

//edit route
router.get("/:id/edit",isLoggedIn,isAllowed,wrapAsync(editListings));

//show route
router.get("/:id",wrapAsync(showListings));

//update route
router.put("/:id",isLoggedIn,isAllowed,upload.single('image'),validateListings,wrapAsync(updateListings));

//post route
router.post("/",isLoggedIn,upload.single('image'),wrapAsync(postListings));

//delete route
router.delete("/:id",isLoggedIn,isAllowed,wrapAsync(deleteListings));

module.exports = router;