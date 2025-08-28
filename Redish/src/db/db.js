const mongoose = require("mongoose")

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to DataBase")
    })
    .catch(err=>{
        console.log(err)
    })
}


module.exports = connectDB;