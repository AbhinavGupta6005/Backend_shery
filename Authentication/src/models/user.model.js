const mongoose = require("mongoose")
// const userModel = require("../models/user.model")

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel;