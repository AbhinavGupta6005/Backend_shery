const express = require('express')

const app = express();

app.use(express.json())

app.get("/home",(req,res)=>{
        res.send("Its home Page !!")
})

let about = [];

app.post("/about",(req,res)=>{
    console.log(req.body);
    about.push(req.body)
    res.json({
        message : 'Note Created is Successfully',
        about : about
    })
})


app.listen(3000, ()=>{
    console.log("Server is running On port 3000...")
})