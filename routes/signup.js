const express = require("express");
const router = express.Router();
const User = require("../models/users");
const wrapAsync = require("../utils/wrapAsync");

router.get("/",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/",wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User ({username,email});
        await User.register(newUser,password);
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}))

module.exports = router;