require('dotenv').config();
const app = require("./src/app.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service.js")


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const chatHistory = [
    
]

// io   =>  io means all the entire server
// socket  => socket means only single user
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected")
    })

    socket.on("ai-message",async (data) => {

        console.log("Recived AI message", data.prompt)

        // To store the previous chat

        chatHistory.push({
            role: "user",
            parts: [{text: data}]
        })
        const response = await generateResponse(chatHistory);

        chatHistory.push({
            role: "model",
            parts: [{text: response}]
        })
        console.log("AI Response", response);
        socket.emit("ai-message-response", { response })
    })
});

httpServer.listen(3000, ()=>{
    console.log("Server running on 3000")
})