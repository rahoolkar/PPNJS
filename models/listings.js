const mongoose = require('mongoose');

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
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;