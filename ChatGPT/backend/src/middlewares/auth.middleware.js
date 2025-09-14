const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken")

async function authUser(req, res, next){
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({message: "Unathorised"});

    }

    try{

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decode.id)

        req.user = user

        next()
    }
    catch(err){
        return res.status(401).json({message: "Unathorised"})
    }
}


module.exports = {
    authUser
}