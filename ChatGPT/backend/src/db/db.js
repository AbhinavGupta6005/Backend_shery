const mongoose = require("mongoose")

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to DB")
    }
    catch(err){
        console.log("Error connectiong to MongoDB:- ", err)
    }
}


module.exports = connectDB;