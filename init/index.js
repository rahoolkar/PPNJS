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
    let newdata = data.map((obj)=>{
        return {...obj,owner : '67b050b1abc229d1b76f376e'}
    })
    await Listing.insertMany(newdata);
}

initDatabase();