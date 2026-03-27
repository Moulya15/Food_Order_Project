const mongoose=requie("mongoose");

const restaurantSchema = new mongoose.schema({
    name:{
        type:String,
        trim:true, // it removes unwanted whitespace
        required:[true, "Please enter the restaurant name"],
        maxLength:[100, "Name cannot excced 100 characters"]
    },
    isVeg:{
        type:Boolean,
        default:false,
    },
    address:{
        type:String,
        required:[true, "please enter the address"],
    },
    ratings:{
        typr:Number,
        default:0
    },
    Location:{
       type: {type:String,
        enum:["Point"],
        required:[true]
    },
    coordinates:{
        type:[Number],
        required:true
    }
    },
    reviews:[{
        name:{
            type:String,
            required:true,
        },
        rating:{
            type:Number,
            required:true,
        },
        comment:{
            type:String,
            required:true
        },
    },],
    images:[{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now,

    }
})

restaurantSchema.index({location:"2dsphere"});//to search them 
restaurantSchema.index({address:"text"});

module.exports=mongoose.model("Restaurant",restaurantSchema);