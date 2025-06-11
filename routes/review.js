const express=require("express");
const router=express.Router({mergeParams:true}) //merge params lets access req.params from parent route link to child..
const Review=require("../models/review.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")  //JOI :used for schema and data validation
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js")
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



// -----------CREATING FOR REVIEWS------------------
//Review post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete For Reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;