const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Path = require("path");
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const listing = require("./routes/listings.js");
const review  = require("./routes/review.js")
const session = require('express-session')
const myError = require("./utils/myError.js")
const flash = require('connect-flash');

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

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000 ,
        httpOnly : true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
})

app.use("/listings",listing);
app.use("/listings/:id/reviews",review);

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

