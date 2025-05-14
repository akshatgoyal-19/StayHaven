const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review.js")


const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:{
            type:String,
            default: "https://images.unsplash.com/photo-1738189669835-61808a9d5981?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v)=>v===""
                ?"https://images.unsplash.com/photo-1738189669835-61808a9d5981?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                :v    //setting default value/url for img via ternary operator
        },
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },geoLocation:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },category:{
        type:String,
        enum:[
            "trending",
            "rooms",
            "iconicCities",
            "mountains",
            "castles",
            "amazingPools",
            "camping",
            "farms",
            "arctic",
            "dorms",
            "boats",
        ],
    },
    // category:{
    //     type:String,
    //     enum:["mountain","arctic","farms","deserts"]

    // }
})

//creating a post mongoose middleware in order to delete review from db incase listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing =mongoose.model("Listing",listingSchema);

module.exports=Listing;