if(process.env.NODE_ENV!="production"){
    require('dotenv').config()  //for using env in backend
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
const path=require("path")
const methodOveride=require("method-override");
const ejsMate=require("ejs-mate"); // used for further templating
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")  //JOI :used for schema and data validation
const session=require("express-session")  //express-sessions : used for creating sessions and session cookies
const MongoStore = require('connect-mongo');
const flash=require("connect-flash") //connect flash to put message that appears only once in ejs eg. new user registered and refreshing takes them away
const passport=require("passport")  // npm: for login and signup authentication
const LocalStrategy=require("passport-local") //for local signin process i.e. using email and password etc
const User=require("./models/user.js")

 
//routes
const listingRouter=require("./routes/listing.js")  //express router
const reviewRouter=require("./routes/review.js")  //express router
const userRouter=require("./routes/user.js"); //expresss-router for user

const dbUrl=process.env.ATLASDB_URL
main().then(()=>{
    console.log("connected to db")
}).catch(()=>{
    console.log("err")
}) 

async function main(){
    await mongoose.connect(dbUrl)
}


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOveride("_method"));
app.engine("ejs",ejsMate) //ejs-mate
app.use(express.static(path.join(__dirname,"public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600 //seconds
})

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions={ //express-session options (needs to be written) creates a default session cookie
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000, //in miliseconds cookie expiring date : 7days
        maxAge: 7*24*60*60*1000,  //if not mentioned expiry/maxage default set to closing of browser
        httpOnly:true,   //for security purpose
    }
}  


app.use(session(sessionOptions)); //using sessions
app.use(flash()); //using connect-flash

//passport (always after sessions)
app.use(passport.initialize()) //initialize pasport
app.use(passport.session()); // to identify user when moving bw diff pages
passport.use(new LocalStrategy(User.authenticate())) //static method used to authenticate


passport.serializeUser(User.serializeUser()); //static method used to store user info in a session 
passport.deserializeUser(User.deserializeUser()); //....removes/unstore after session
//


app.use((req,res,next)=>{  
    res.locals.success=req.flash("success"),
    res.locals.error=req.flash("error"),
    res.locals.currentUser=req.user;
    next();
})

//route for demouser
// app.use("/demouser",async (req,res)=>{
//     let fakeUser= new User({
//         email:"student@mail.com",
//         username:"stu",
//     })
//     let registeredUser= await User.register(fakeUser,"helloworld") //register is a static method (data,"password")..also itself check if username unique or not 
//     res.send(registeredUser)
// })

//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"





app.get("/",(req,res)=>{
    res.redirect("/listings");
})


//express router for listing
app.use("/listings",listingRouter)

//express router for reviews
app.use("/listings/:id/reviews",reviewRouter)

//express router for user
app.use("/",userRouter)



//error handling middleware 
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message})  
})

const port= process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`listening at port ${port}`)
})

