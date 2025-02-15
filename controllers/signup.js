module.exports.getSignupPage = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        let newUser = new User ({username,email});
        let registereduser = await User.register(newUser,password);
        req.login(registereduser,(error)=>{
            if(error){
                return next(error);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        })
    }catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
};