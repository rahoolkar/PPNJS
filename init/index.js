const mongoose = require('mongoose');
const Listing = require("../models/listings.js");
const {data} = require("./data.js");

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/my_test_db');
}

function deleteDatabase(){
    Listing.deleteMany({}).then((result)=>{
        console.log(result);
    }).catch((error)=>{
        console.log(error);
    })
}

deleteDatabase();

async function initDatabase(){
    let result = await Listing.insertMany(data);
    console.log(result);
}

initDatabase();