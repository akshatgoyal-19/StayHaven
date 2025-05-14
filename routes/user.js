const express=require("express");
const router = express.Router()
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport")
const {saveRedirectUrl}=require("../middleware.js");
const userControl = require("../controllers/user.js");


//signup requests
router
    .route("/signup")
    .get(userControl.renderSignupForm)
    .post(wrapAsync(userControl.signup))

//login requsts
router
    .route("/login")
    .get(userControl.renderLoginForm)
    .post(saveRedirectUrl,passport.authenticate('local', {failureRedirect:'/login', failureFlash:true}),userControl.login)

router.get("/logout",userControl.logout)

module.exports=router;