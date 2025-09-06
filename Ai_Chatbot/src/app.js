const express = require('express');


const app  = express();

app.get('/', (req,res) => {
    res.send("Hellow World!");
})


module.exports = app;