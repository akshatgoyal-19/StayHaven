const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js")

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async ( )=> {
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"67fa43a991a61fecb233d9c9"})); //adding owner (tester) to each listing creates new array with copying obj of init and overwriting it with old obj and owner field
    await Listing.insertMany(initdata.data);
    console.log("data initialised")
}

initDB();