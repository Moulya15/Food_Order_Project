//start the server

//load env variable
//start the server

//import app
const app= require("../Backend/app");

const connectDatabase= require('./db')

//import dotenv
const dotenv = require('dotenv');
// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});
dotenv.config({path:"./config/config.env"});

connectDatabase();

//start the server
//if we have to access the env avr thn we have to mention process.env...
const server= app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`)
})

//each router handles different functionalities i.e., urls
// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to Unhandled Promise rejection");
  server.close(() => process.exit(1));
});