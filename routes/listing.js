const express=require("express");
const router = express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema,reviewSchema}=require("../schema.js")  //JOI :used for schema and data validation
const ExpressError=require("../utils/ExpressError.js")
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const listingController =require("../controllers/listings.js") //mvc ==> conntroller ... store (req,res)=>{..} in another file
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage })


///------------------LISTINGSS-----------------------------------------------------
//index route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));
//-----create new--------
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm)
//create route
//router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//------edit and updation route-------
//edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))
//update route
//router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))

//show route
//router.get("/:id",wrapAsync(listingController.showListing))

//delete route
//router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

router
    .route("/:id")
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))


module.exports=router;