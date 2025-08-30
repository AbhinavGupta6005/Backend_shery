require('dotenv').config();
const app = require('./src/app')
const connectDB = require('./src/db/db')

// Connect to MongoDB
connectDB();


app.listen(3000,()=>{
    console.log("Server on Running on port 3000")
})