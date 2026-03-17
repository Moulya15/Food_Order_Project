const mongoose=require("mongoose");
const validator=require("validator"); // to validate such as @ in gamil etc
const bcrpt=require("bcrypt");
const jwt=require("jsonwebtoken");

//create new schema
const userSchema= mongoose.Schema({
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
    passwordRestToken:String,
    passwordResetExpire:Date,
}, {timeStamps:true})

//this will run automatically before saving the username