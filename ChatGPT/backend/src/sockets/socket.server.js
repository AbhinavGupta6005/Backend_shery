const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
const aiService = require("../services/ai.service.js");
const messageModel = require("../models/message.model.js");
const { createMemory , queryMemory } = require("../services/vector.service.js");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // 🔐 Middleware: verify user
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No Token provided!"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (err) {
      console.error("JWT verification failed:", err.name, "-", err.message);
      next(new Error("Authentication Error: Invalid token"));
    }
  });


  io.on("connection", (socket) => {
    
    socket.on("ai-message", async (messagePayload) => {
      // 1️. Save user message to DB
      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.message,
        role: "user",
      });

      // 2️. Create embedding + store in Pinecone
      const vectors = await aiService.generateVector(messagePayload.message);

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata : {}
      }) 

      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.message
        },
      });

      

      // 3️. Fetch recent chat history
      const chatHistory = ( 
        await messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.map(item=>{
        return {
          role: item.role,
          parts: [{text: item.content}]
        }
      })


      const ltm = [
        {
          role: "user",
          parts: [{text:
            `there are som eprevious message from the chat, use them to generate the response
            ${memory.map(item=>item.metadata.text).join("\n")}`
          }]
        }
      ]


      // 4️. Generate AI response
      const response = await aiService.generateResponse([...ltm, ...stm]);

      // 5️. Save AI response to DB
      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      const responseVector = await aiService.generateVector(response);

      await createMemory({
        vectors: responseVector,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response
        },
      })

      // 6️. Send AI response to client
      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
