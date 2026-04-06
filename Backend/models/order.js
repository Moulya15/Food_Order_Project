const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    deliveryInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        }
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Restaurant',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        images: {
            type: String,
            required: true,
        },
        foodItem: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'FoodItem',
        },
        price: {
            type: Number,
            required: true,
        }
    }
    ],
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        }
    },
    paidAt: {
        type: Date,
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        default: 0.0,
    },
    deliveryCharge: {
        type: Number,
        default: 0.0,
    },
    finalTotal: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//stock management
//before taking the order
// 1. check the stock of each food item
// 2. verify stock
// 3.reduce stock
// 4.save
//pre save middleware

//user places order
//backend receives order details
//before saving => check stock
//reduce stock
//save order
//return response

orderSchema.pre('save', async function (next) {
    try {
        for (const orderItem of this.orderItems) {
            const foodItem = await mongoose.model('FoodItem').findById(orderItem.foodItem);
            if (!foodItem) {
                throw new Error("Food item not found");
            }
            if (foodItem.stock < orderItem.quantity) {
                throw new Error(`Insufficient stock for ${orderItem.name}`)
            }
            foodItem.stock -= orderItem.quantity;
            await foodItem.save();
        }
        next()
    } catch (error) {
        next(error);
    }
    })

    module.exports=mongoose.model("Order", orderSchema);