const Menu = require("../models/menu");
const ErrorHandler=require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");

exports.getAllMenu= catchAsyncErrors(async(req,res,next)=>{
    //filter logic
    ////2 cases 1. restaurant exist -> show particular menu
        //   2. restaurant doesn't exist -> show all menu
    const filter= req.params.storeId ? {restaurant:req.params.storeId} : {};

    //fetch data from database
    const menu= await Menu.filter(filter).populate("menu-items");
    //populate replace id with full data
    //without populate:
// items: [id1,id2]
// with populate:
// items:[{name: pizza}, {name: burger}]

res.status(200).json({
status:"success",
count:menu.length,
data:menu
})
})

//Create Menu
exports.createMenu = catchAsyncErrors(async (req, res, next)=>{
const menu =await Menu.create(req.body);
res.status(201).json({
    status: "success", data:menu
})
})

//delete Menu
exports.deleteMenu= catchAsyncErrors(async (req, res, next)=>{
const menu = await Menu.findByIdAndDelete(req.params.menuId);
if(!menu) {
return next(new ErrorHandler("No menu found with that ID",404))
}
res.status(204).json({status:"success"})
})

//add items into menu
exports.addItemsToMenu = catchAsyncErrors(async(req, res, next)=>{
const {category, items} = req.body;
const menuId =req.params.menuId;
if(!menuId) {
return next(new ErrorHandler("Please provide menuId", 400))
}
const menu= await Menu.findById(menuId);
if(!menu){
return next(new ErrorHandler("No menu found with that ID",404))
}
//find Category
let cat= menu.menu.find((c)=>c.category === category);

//if cat not found then create new one
if(!cat){
cat= {category, items: []};
menu.menu.push(cat);
}
//add items to category
cat.items.push (foodItemId);
await menu.save();
await menu.populate("menu.items")
res.status(200).json({status:"success", data:menu})
})