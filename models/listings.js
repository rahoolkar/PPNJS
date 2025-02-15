const { ref } = require('joi');
const mongoose = require('mongoose');
const Review = require("./reviews.js");
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : "https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg",
        set : (v) => v===""? "https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg": v
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})


//mongoose middleware
listingSchema.post("findOneAndDelete",async(data)=>{
    await Review.deleteMany({_id : {$in : data.reviews}});
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;