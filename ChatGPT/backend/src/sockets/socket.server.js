const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model.js")
const aiService = require("../services/ai.service.js")
const messageModel = require("../models/message.model.js")
const {createMemory, queryMemory} = require("../services/vector.service.js")

function initSocketServer(httpServer){
    const io = new Server(httpServer, {})

    io.use(async(socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        // console.log("Socket connection cookie:- ", cookies)
        if(!cookies.token){
            next(new Error("Authentication error: No Token provided!"))
        }

        try{

            const decode = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user  = await userModel.findById(decode.id)
            socket.user = user
            next()
        }
        catch (err) {
            console.error("JWT verification failed:", err.name, "-", err.message);
            next(new Error("Authentication Error: Invalid token"));
        }

    })

    io.on("connection", (socket) => {
        socket.on("ai-message",async(messagePayload)=>{

            // console.log(messagePayload);

            // await messageModel.create({
            //     chat: messagePayload.chat,
            //     user: socket.user._id,
            //     content: messagePayload.message,
            //     role: "user"
            // })

            const vectors = await aiService.generateVector(messagePayload.message);

            await createMemory({
                vectors,
                messageId:"564646",
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id
                }
            })


            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({createdAt: -1}).limit(20).lean()).reverse();

           

            const response = await aiService.generateResponse(chatHistory.map(item=>{
                return{
                    role: item.role,
                    parts: [{text: item.content}]
                }
            }));

            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            })

            socket.emit('ai-response',{
                content: response,
                chat: messagePayload.chat
            })
        })
    })
}


module.exports = initSocketServer;