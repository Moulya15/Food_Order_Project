//start the server

//load env variable
//start the server

//import app
const app= require("./app");

const connectDatabase= require('./db')

//import dotenv
const dotenv = require('dotenv');

dotenv.config({path:"./config/config.env"});

connectDatabase();

//start the server
//if we have to access the env avr thn we have to mention process.env...
const server= app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`)
})

//each router handles different functionalities i.e., urls