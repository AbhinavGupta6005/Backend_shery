// const { default: mongoose } = require("mongoose")
const mongoose = require("mongoose")


function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("MongoDB connected successfully");
    })
    .catch((error)=>{
        console.log("MongoDB connection failed", error)
    })
}


module.exports = connectDB;