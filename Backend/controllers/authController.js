const User=require("../models/user");
const jwt=require("jsonwebtoken");
const sendToken = require("../utils/sendToken")
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ErrorHandler=require("../utils/errorHandler")

//register user
exports.signup= catchAsyncErrors (async (req,res)=>{
    const {name,phoneNumber,email,password,passwordConfirm}= req.body;

let avatar={};

//if avatar is not available or default avatar
// if(!req.body.avatar || req.body.avatar==="/images/images.png"){
//     avatar={
//         public_id:"default",
//         url:"/images/images.png"

//     };
// }

const user= await User.create({
name,
phoneNumber,
email,
password,
passwordConfirm, 
});
sendToken(user,200,res);
});

//login 
exports.login= catchAsyncErrors (async (res,req,next)=>{
    const {email,password} = req.body;

    if(!mail || !password){
        return next(new ErrorHandler("Please enter Correct Mail or Password", 400))
    }
    const user=await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatched= await User.correctPassword(password,user.password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password",401))
    }

    sendToken(user,200,res);
})