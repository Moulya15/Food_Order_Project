const User=require("../models/user");
const jwt=require("jsonwebtoken");
const sendToken = require("../utils/sendToken")
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ErrorHandler=require("../utils/errorHandler");

const crypto = require("crypto");
const { promisify } = require("util");
const Email = require("../utils/email");

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
exports.login= catchAsyncErrors (async (req, res, next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter Correct Mail or Password", 400))
    }
    const user=await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    const isPasswordMatched= await user.correctPassword(password,user.password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password",401))
    }

    sendToken(user,200,res);
})

exports.logout= catchAsyncErrors(async(req,res,next)=>{
//after logout we need to remove the cookie
res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly:true
});

res.status(200).json({
    success:true,
    message:"Logged out successfully"
})
})

//get user profile

exports.getUserProfile=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
})

// Protect Route
exports.protect = catchAsyncErrors(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new ErrorHandler(
        "You are not logged in! Please log in to get access.",
        401,
      ),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//promisify is used to convert callback based function into something that returns a promise, so we can use async/await with it.

  if (!currentUser) {
    return next(
      new ErrorHandler("User no longer exists. Please login again.", 401),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ErrorHandler(
        "User recently changed password ! please log in again.",
        404,
      ),
    );
  }

  req.user = currentUser;

  next();
});


// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const isMatched = await user.correctPassword(oldPassword, user.password);

  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("There is no user with email address .", 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${process.env.FRONTEND_URL}/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(
        "There was an error sending the email, try again later!",
        500,
      ),
    );
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendToken(user, 200, res);
});
