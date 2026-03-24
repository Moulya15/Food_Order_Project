const User=require("../models/user");
const jwt=require("jsonwebtoken");
const sendToken = require("../utils/sendToken")
const catchAsyncErrors=require("../middleware/catchAsyncErrors");

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
