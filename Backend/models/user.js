const mongoose = require("mongoose");
const validator = require("validator");// to validate such as @ in gmail etc
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
//create new schema
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"],
        maxlength:[30,"Name cannot exceed 30 characters"]
    },
    email:{
        required:[true, "Please enter your mail"],
        type:String,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Please enter correct Email"],
    },
    password:{
        type:String,
        minlength:[6,"Password should be atleast 6 characters"],
        required:[true,"Please enter your password"],
        select:false,
    },
    passwordConfirm:{
        type:String,
        required:true,
        validate:{
            validator: function(el){
                return el==this.password;
            },
            message:"This is not same as password entered"
        }
    },
    phoneNumber:{
        type:String,
        required:true,
        match:[/^[0-9]{10}$/, "Please enter valid number"]
    },
    role:{
        type:String,
        enum:["user","restaurant-owner","admin"],
        default:"user"
    },
    avatar:{
        public_id:String,
        url:String,
    },
    passwordChangedAt:Date,
passwordResetToken: String,
passwordResetExpires: Date,
}, {timestamps:true})

//this will run automatically before saving the username
// HASH PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

//create JWT Token
userSchema.methods.getJWTToken=function(){
    //is is ngt but in mongo for everthing it will create id so that is what we are reffering here
    return jwt.sign({ id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_TIME})
}

//compare password during login
userSchema.methods.correctPassword=async function(candidatePassword, userPassword){
return await bcrypt.compare(candidatePassword, userPassword)
};

// CHECK IF PASSWORD CHANGED AFTER JWT
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};


// PASSWORD RESET TOKEN
userSchema.methods.createPasswordResetToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports=mongoose.model("User", userSchema);