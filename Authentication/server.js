require("dotenv").config();
const connectDB = require("./src/db/db")
const app = require("./src/app")

connectDB()
app.listen(3000,()=>{
    console.log("Server runnning on 3000 Port")
})