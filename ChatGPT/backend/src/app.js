const express = require('express')
const cookieParser = require('cookie-parser');

// Routes 
const authRoutes = require("./routes/auth.routes.js")
const chatRoutes = require("./routes/chat.routes.js")


const app = express();

// using middleware
app.use(express.json());
app.use(cookieParser())

// Usnig routes
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)




module.exports = app;