const Listing = require("../models/listing.js");
const Review=require("../models/review.js")


//review-post
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review)
    newReview.author=req.user._id
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save() 
    req.flash("success","New Review Created!") //connect-flash ..recorded in a key:value pair

    res.redirect(`/listings/${listing._id}`)
}

module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})  //$pull optr removes from an existing array all instances of a value or values matching some condition
    //from the reviews array inside listings db , the value matching to reviewid is pulled and deleted
    
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted!") //connect-flash ..recorded in a key:value pair

    res.redirect(`/listings/${id}`)

}