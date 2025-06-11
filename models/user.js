const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose") // npm for login / signup with hash and salt.

const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    }, //password and username is automatic created by passport Local -mongoose
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

