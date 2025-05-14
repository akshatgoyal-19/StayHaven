const user = require("../models/user");
const User=require("../models/user")

//signup-get
module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs")
}

//signup-post
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password)
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{ //passport feature help to login after signup autommatcialy
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!")
        res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")

    }
}

//login-get
module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs")
}
//login-post
module.exports.login=async(req,res)=>{    //passport.authenticate("local",{failureRedirect:"/login"}),callback fn
    req.flash("success","Welcome to Wanderlust!");
    let redirectUrl= res.locals.redirectUrl || "/listings"
    
    res.redirect(redirectUrl);

}

//logout
module.exports.logout=(req,res,next)=>{  //logout passport inbuilt property
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","successfully logout")
        res.redirect("/listings")
    }) 
    
}