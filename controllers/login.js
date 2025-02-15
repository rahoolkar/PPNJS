module.exports.getLoginPage = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin = function(req, res) {
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
}