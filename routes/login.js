const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/",(req,res)=>{
    res.render("users/login.ejs");
})

//middlware for storing the last visited url
const redirect = function(req,res,next){
    if(req.session.lastUrl){
        res.locals.lastUrl = req.session.lastUrl;
    }
    next();
}

router.post('/',redirect, 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }),
    function(req, res) {
        try{
            req.flash("success","Welcome to WanderLust !");
        if(res.locals.lastUrl){
            redirectUrl = res.locals.lastUrl;
        }else{
            redirectUrl = "/listings";
        }
        res.redirect(redirectUrl);
        }catch(error){
            req.flash("error",error.message);
            res.redirect("/login");
        }
    });

module.exports = router;