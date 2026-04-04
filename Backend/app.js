// //configure express and middleware


// //app.js -> build the engine
// //server.js ->  start the engine


// //import packages
// //create express app
// //configure middleware
// //export the app

// //import express
// const express= require('express');

// // create express application
// const app= express();//this will control entire app 
// const authRoutes=require("./routes/auth")

// //import middleware packages
// const cors=require('cors');
// const bodyParser = require('body-parser');

// //middleware is the function the runs between request and response
// //like it checks if the user is logged in or not or if he is a legit user

// //client => middleware => rount => response

// //user middleware
// app.use(cors());
// app.use(express.json());//to read json data sent from the client
// app.use(bodyParser.urlencoded({extended:true}));//to read form data sent from frontend
// //the data comes like a sealed envelop so this body parser opens it so that server can read the message

// // app.get("/",(req,res)=>{
// //     res.send("Server is running");
// // })

// app.use("/api/user",authRoutes);

// module.exports=app;

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middleware/errors");

// Middlewares
app.use(cors());
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));
app.use(cookieParser());
app.use(fileUpload());

// Routes
const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const order = require("./routes/order");
const auth = require("./routes/auth");
// const payment = require("./routes/payment");
// const cart = require("./routes/cart");

app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
// app.use("/api/v1", payment);
// app.use("/api/v1/eats/cart", cart);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;