const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")


const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/auth",authRoutes)



module.exports = app