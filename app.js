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

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings",listing);
app.use("/listings/:id/reviews",review);
app.use("/signup",user);
app.use("/login",login);

app.get("/demouser",async(req,res)=>{
    let fakedata = new User({email:"ghi@google.com",username:"ghi"});
    let ans = await User.register(fakedata,"ghi@123");
    // await fakedata.setPassword('abc@123');
    // await fakedata.save();
    // const {user} = await User.authenticate()('abc', 'abc@123');
    res.send(ans);
})

//error middleware
app.use((err,req,res,next)=>{
    let {status = 500,message = "page not found"} = err;
    console.log(err)
    res.render("error.ejs",{status,message});
})

app.listen(8080,()=>{
    console.log("app is running on server 8080");
})

