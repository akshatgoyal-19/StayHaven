//middleware for login authentication for edit,create purpose
const Listing=require("./models/listing")
const Review=require("./models/review.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")  //JOI :used for schema and data validation

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()) {
        //redirect url after login
        req.session.redirectUrl=req.originalUrl
        req.flash("error","Login required to perform action")
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let user = await Listing.findById(id);
    if(!user.owner.equals(res.locals.currentUser._id)){
        req.flash("error","Owner Validation Failed")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validateListing=(req,res,next)=>{     //joi fn prevents invalid entry from client side eg hopscocth
    let {error}=listingSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg)
        }else{
            next();
        }
}

module.exports.validateReview=(req,res,next)=>{       //joi fn 
    let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg)
        }else{
            next();
        }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let user = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){     
        req.flash("error","Author Validation Failed")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

