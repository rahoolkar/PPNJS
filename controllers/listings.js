const Listing = require("../models/listings");

module.exports.index = async(req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/index.ejs",{listings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListings = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing not found :(")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.postListings = async(req,res,next)=>{
    let data = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    let newdata = new Listing(data);
    newdata.owner = req.user._id;
    newdata.image = {url,filename};
    await newdata.save()
    req.flash("success","New Listing created !")
    res.redirect("/listings"); 
}

module.exports.editListings = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exists :(");
        req.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    let newChangedUrl = originalUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit.ejs",{listing,newChangedUrl});
}

module.exports.updateListings = async(req,res)=>{
    let {id} = req.params ;
    let data = req.body;
    let listing = await Listing.findByIdAndUpdate(id,data);
    if(typeof(req.file)!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing edited!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}