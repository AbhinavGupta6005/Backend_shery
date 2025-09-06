require('dotenv').config();
const app = require("./src/app.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service.js")


const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

// io   =>  io means all the entire server
// socket  => socket means only single user
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })

    socket.on("ai-message",async (data) => {
        console.log("Recived AI message", data.prompt   )
        const response = await generateResponse(data.prompt);
        console.log("AI Response", response)
    })
});

httpServer.listen(3000, ()=>{
    console.log("Server running on 3000")
})