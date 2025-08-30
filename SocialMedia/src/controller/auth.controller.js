const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt= require("bcryptjs")


async function registerController(req, res){
    const {username, password} = req.body

    const isUserAlreadyExits = await userModel.findOne({username});

    if(isUserAlreadyExits){
        return res.status(400).json({
            message: "User Already Exits"
        });
    }

    const user = await userModel.create({
        username,
        password: await bcrypt.hash(password, 10)
    })

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

    res.cookie("token", token)

    return res.status(201).json({
        message: "User Registered Sussessfully"
    })
}

async function loginController(req,res){
    const {username, password} = req.body

    const user = await userModel.findOne({
        username
    })

    if(!user){
        return res.status(400),json({
            message: "User Not Found !"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({message: "Invalid Password"})
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.status(200).json({
        message: "User logged Successfully",
        user:{
            username: user.username,
            id: user._id
        }
    })
}

module.exports = {
    registerController,
    loginController
}