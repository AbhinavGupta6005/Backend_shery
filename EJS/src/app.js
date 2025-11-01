const express = require("express")
const morgan = require('morgan')

const app = express();

app.use(morgan("dev"))

app.set("view engine", "ejs");

app.post("/api/auth/register",(req,res)=>{
    res.status(201).send({message: "User registered successfully"})
})

app.get("/",(req,res)=>{
    res.render("index",{messages: [
        "Hello from EJS",
        "Welcome to the Express view engine",
        "This is a sample message",
        "EJS makes templating easy",
        "Enjoy coding with EJS"
    ]}); // what ever the file name off EJS file it in the place of index
})

module.exports = app;