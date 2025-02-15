const express = require("express");
const router = express.Router();
const passport = require("passport");
const {getLoginPage,postLogin} = require("../controllers/login");


//middlware for storing the last visited url
const redirect = function(req,res,next){
    if(req.session.lastUrl){
        res.locals.lastUrl = req.session.lastUrl;
    }
    next();
}

//getting the login page
router.get("/",getLoginPage);

//post login route
router.post('/',redirect, 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash : true }),
    postLogin);

module.exports = router;