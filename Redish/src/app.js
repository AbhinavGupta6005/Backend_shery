
const express = require("express")
const authRoutes = require("./routes/auth.routes")
const cookie = require("cookie-parser")

const app = express();
app.use(express.json());
app.use(cookie);

app.use("/auth", authRoutes)




module.exports = app;