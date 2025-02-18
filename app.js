require('dotenv').config()
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Path = require("path");
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const listing = require("./routes/listings.js");
const review  = require("./routes/review.js");
const user = require("./routes/signup.js");
const login  = require("./routes/login.js");
const session = require('express-session');
const flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const User = require("./models/users.js");
const myError = require("./utils/myError.js");

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
app.use(flash()); //flash uses express session
app.use(passport.initialize()); //passport uses express session
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware 
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
})

app.use("/listings",listing);
app.use("/listings/:id/reviews",review);
app.use("/signup",user);
app.use("/login",login);

app.get("/logout",(req,res)=>{
    req.logout((error)=>{
        if(error){
            next(error);
        }else{
            req.flash("success","You logged out !!")
            res.redirect("/listings");
        }
    })
})

// app.all("*",(req,res,next)=>{
//     throw new myError(404,"Page Bihari le gaye");
// })

//error middleware
app.use((err,req,res,next)=>{
    let {status = 500,messege = "page not found"} = err;
    console.log(err)
    res.render("error.ejs",{status,messege});
})

app.listen(8080,()=>{
    console.log("app is running on server 8080");
})

