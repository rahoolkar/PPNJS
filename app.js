const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings");
const Path = require("path");
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync.js");
const myError = require("./utils/myError.js");
const {listingschema,reviewschema} = require("./schema.js");
const Review = require("./models/reviews.js")

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'))
app.use(express.static(Path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"/views"));
app.engine('ejs', engine);

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/my_test_db');
}

//middleware for the post route 
const validateListings = (req,res,next)=>{
    let data = req.body;
    let result = listingschema.validate(data);
    if(result.error){
        throw new myError(400,result.error);
    }else{
        next();
    }
}

//index route
app.get("/listings",wrapAsync(async(req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
}))

//new route 
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

//update route
app.put("/listings/:id",validateListings,wrapAsync(async(req,res)=>{
    let {id} = req.params ;
    let data = req.body;
    await Listing.findByIdAndUpdate(id,data);
    res.redirect(`/listings/${id}`);
}))

//post route
app.post("/listings",validateListings,wrapAsync(async(req,res,next)=>{
    let data = req.body;
    let newdata = new Listing(data);
    await newdata.save()
    res.redirect("/listings"); 
}))

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

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
app.delete("/listings/:lid/reviews/:rid",async(req,res)=>{
    let {lid,rid} = req.params;

    await Review.findByIdAndDelete(rid);
    await Listing.findByIdAndUpdate(lid,{ $pull : {reviews : rid} });
    res.redirect(`/listings/${lid}`);
})

//post route for the review 
app.post("/listings/:id/reviews",validateReviews,wrapAsync(async (req,res)=>{
    let data = req.body;
    let {id} = req.params;
    let newReview = new Review(data);
    let listing = await Listing.findById(id);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
}))

//* route
// app.all("*",(req,res)=>{
//     throw new myError(401,"Page Bihari le gaye");
// })

//error middleware
app.use((err,req,res,next)=>{
    let {status = 500,message = "page not found"} = err;
    console.log(err)
    res.render("error.ejs",{status,message});
})

app.listen(8080,()=>{
    console.log("app is running on server 8080");
})

