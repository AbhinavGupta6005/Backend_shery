const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")




const router = express.Router();

// POST  /register req.body = {username,password}

router.post("/register", async (req,res)=>{
    const {username,password} = req.body

    const isUserAreadyExist = await userModel.findOne({
        username,
        password
    })                                            // not exits the username the it goes to Null return

    if(isUserAreadyExist){
        return res.status(409).json({
            message : "username is already in use"
        })
    }

    const user = await userModel.create({username,password})

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

    res.cookie("cookie", token);

    res.status(201).json({
        message: "user Register Successfully",
        user
    })
})


module.exports = router;