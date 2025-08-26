const mongoose = require("mongoose")

function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to DATABASE")
    })
    .catch(error=>{
        console.log(error)
    })
}

module.exports = connectDB;