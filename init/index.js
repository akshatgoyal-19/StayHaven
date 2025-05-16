const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js")

const MONGO_URL="mongodb+srv://akshatgoyal:N3ccoHKeXUuUDO5T@cluster0.0bfi9j2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async ( )=> {
    //await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6824f09333600911614f4b6c"})); //adding owner (tester) to each listing creates new array with copying obj of init and overwriting it with old obj and owner field
    await Listing.insertMany(initdata.data);
    console.log("data initialised")
}

initDB();