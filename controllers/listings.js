const Listing=require("../models/listing")

async function getGeoJSON(address) {
    console.log(address);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();

    if (data.length === 0) {
        console.error("No results found");
        return null;
    }
    const { lat, lon } = data[0];
    return {
        geometry: {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
        }
    };
}

// //search
module.exports.index = async (req, res) => {
    const { search, category } = req.query;
    let filter = {};

    if (search) {
        filter.title = { $regex: search, $options: "i" }; // partial, case-insensitive match
    }

    if (category) {
        filter.category = category;
    }

    const listing = await Listing.find(filter);
    res.render("listings/index", { listings: listing, search });
};

// //listings
// module.exports.index=async (req,res)=>{
//   const { category } = req.query;
//     let listings;
//     if (category) {
//         listings = await Listing.find({ category }); // MongoDB filter
//     } else {
//         listings = await Listing.find({});
//     }
//     res.render('./listings/index.ejs', { listings, category });
// }

//create -get
module.exports.renderNewForm=(req,res)=>{
    res.render("./listings/new.ejs")
}

//post create
module.exports.createListing=async(req,res,next)=>{

    //let {title,description,image,price,country,location} = req.body; instead we make listing obj where key is attribute..check new.ejs
    // let listing=req.body.listing;
    // new Listing(listing) ...writing these 2 lines to add can be replaced by below code
    let url=req.file.path;
    let filename=req.file.filename

        const newListing=new Listing(req.body.listing)
        newListing.image={url,filename}
        let resp=await getGeoJSON(newListing.location);
        newListing.geoLocation = resp.geometry
        newListing.owner=req.user._id;
        let a=await newListing.save()
        console.log(a)
        req.flash("success","New Listing Created!") //connect-flash ..recorded in a key:value pair
        let b=res.redirect("/listings")
        console.log(b)
    }

    //:id
module.exports.showListing=async (req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
        if(!listing){
            req.flash("error","Requested Listing doesnot exist"); //connect-flash ..recorded in a key:value pair
            return res.redirect("/listings");
        }
        res.render("./listings/show.ejs",{listing})
        
    }

    
    //edit-get
    module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","Requested Listing doesnot exist") //connect-flash ..recorded in a key:value pair
        return res.redirect("/listings")
    }
    let originalImageUrl=listing.image.url;
    replaceImageUrl=originalImageUrl.replace("/upload","/upload/w_250")

    res.render("./listings/edit.ejs",{listing,replaceImageUrl})
}

//edit-post
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    //let listing= await Listing.findById(id)
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename
    listing.image={url,filename}
    }
    let resp=await getGeoJSON(listing.location);
    listing.geoLocation = resp.geometry;
    await listing.save();
    req.flash("success","Listing Updated!") //connect-flash ..recorded in a key:value pair
    res.redirect(`/listings/${id}`)
}

//delete 
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing =await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success","Listing Deleted!") //connect-flash ..recorded in a key:value pair
    res.redirect("/listings")
}