//configure express and middleware


//app.js -> build the engine
//server.js ->  start the engine


//import packages
//create express app
//configure middleware
//export the app

//import express
const express= require('express');

// create express application
const app= express();//this will control entire app 

//import middleware packages
const cors=require('cors');
const badyParser= require('body-parser');
const bodyParser = require('body-parser');

//middleware is the function the runs between request and response
//like it checks if the user is logged in or not or if he is a legit user

//client => middleware => rount => response

//user middleware
app.use(cors());
app.use(express.json());//to read json data sent from the client
app.use(bodyParser.urlencoded({extended:true}));//to read form data sent from frontend
//the data comes like a sealed envelop so this body parser opens it so that server can read the message

app.get("/",(req,res)=>{
    res.send("Server is running");
})

module.exports=app;
