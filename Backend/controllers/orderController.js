const Order=require("../models/order");
const Cart=require("../models/cartModel");
const {objectId}= require("mongodb")
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const ErrorHandler=require("../utils/errorHandler");

//get single order => /api/v1/order/:id
//1.get order ID from url
//2. find order in database usinh order id
//3. if order is not found , return error response
//4. if order is found, return order details in response

//populate join data from another collection

exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    .populate("user","name email")
    .populate(restaurant)
    .exec()

    if(!order){
        return next(new ErrorHandler("Order not found with this ID",404))
    }
    res.status(200).json({
        success:true.
        order
    })
})

//get logged in user order => /api/v1/orders/me
//get loggedin user id
//find orders of the user
//retuen all orders

//backend= filtering data based on user

exports.myOrders=catchAsyncErrors(async(req,res,next)=>{
    const userId=new ObjectID(req.user.id);
    const orders= await Order.find({user:userId})
    .populate("user","name email")
    .populate("restaurant")
    .exec();

    res.status(200).json({
        success:true,
        orders
    })
})

//get all orders

//get all oderser from db
//return orders and total revenue

//backend=data+calculations

exports.allOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find();
    let totalAmount=0;

    orders.forEach((order)=>{
        totalAmount+=order.finalTotal
    });
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })


})