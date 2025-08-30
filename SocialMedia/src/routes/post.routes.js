const express = require('express')
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require("multer")



const upload = multer({
    storage: multer.memoryStorage()
})

// POST  => /api/post [protected]

router.post('/', authMiddleware, createPostController)


module.exports = router;