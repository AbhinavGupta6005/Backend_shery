const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

const router = express.Router()

/*
    post/register
    post/login
    get/user
    get/logout
*/

router.post('/register', async(req, res)=>{
    const {username, password} = req.body

    const user = await userModel.create({
        username,password
    })

    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message : "User register successFully",
        user,
        
    })
})



router.post("/login", async(req,res)=>{
    const {username, password} = req.body

    const user = await userModel.findOne({
        username:username
    })

    if(!user){
        return res.status(401).json({
            message : "user account not found {Invalid Username}"
        })
    }

    const isPasswordValid = password == user.password

    if(!isPasswordValid){
        return res.status(401).json({
            message : "User Password is incorrect!"
        })
    }

    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.status(201).json({
        message : "User loggedIn Successfully...",
        user,
        token,
    })
})


router.get("/user", async(req,res)=>{
    const {token} = req.cookies

    if(!token){
        return res.status(401).json({
            message: "Unathorised"
        })
    }

    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET)  // Token is right or not only check this

        const user = await userModel.findOne({
            _id:decode.id
        }).select("-password")       // .select("-password") it is not send to the frontend

        res.status(200).json({
            message : "User data fetched Successfully",
            user
        })
    }
    catch(err){
        return res.status(401).json({
            message: "Unathorised - Invalid token"
        })
    }
})


module.exports = router;