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
        url : String,
        filename : String
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