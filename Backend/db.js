const mongoose = require('mongoose');

//function to connect database to mongoDB

const connectDatabase= ()=>{
    mongoose.connect(process.env.MONGO_URI).then((con)=>{
        console.log(`MongoDB connected successfully with HOST :${con.connection.host}`)
    })
    .catch((error)=>{
        console.log(`Error connecting to mongoDB: ${error.message}`)
    })
}

module.exports=connectDatabase;