const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware.js")
const chatController = require("../controllers/chat.controller.js")


const router = express.Router();


// Post    /api/chat/  
router.post("/", authMiddleware.authUser, chatController.createChat)

module.exports = router;