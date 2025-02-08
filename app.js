const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listings");
const Path = require("path");
const methodOverride = require('method-override')

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"/views"));


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/my_test_db');
}

//index route
app.get("/listings",async(req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/index.ejs",{listings})
})

//new route 
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params ;
    let data = req.body;
    await Listing.findByIdAndUpdate(id,data);
    res.redirect(`/listings/${id}`);
})

app.post("/listings",async(req,res)=>{
    let data = req.body;
    let newdata = new Listing(data);
    let result = await newdata.save()
    console.log(result);
    res.redirect("/listings"); 
})

app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log("app is running on server 8080");
})

