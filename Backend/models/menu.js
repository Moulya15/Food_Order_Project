//we need categories like staters main course
//inside eac category: item
//wjole mneu belong to restaurant




const mongoose= require=("mongoose");
const menuSchema= new mongoose.Schema({
    menu:[{
        category:{type:String, required:true},
        items:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"FoodItem"// while exporting it should be in capital letter so here we have taken the captial F itself
        }]
    }],
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:String
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)

const Menu = mongoose.model("Menu",menuSchema);
module.exports=Menu;