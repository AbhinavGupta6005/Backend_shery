require('dotenv').config();
const express = require("express");
const app = require("./src/app.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const generateResponse = require("./src/service/ai.service.js");

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

    
// Optional: You can store history per user/socket if needed
const userHistories = new Map();

io.on("connection", (socket) => {
    console.log(`✅ User connected [id: ${socket.id}]`);

    // Initialize user's chat history
    userHistories.set(socket.id, []);

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected [id: ${socket.id}]`);
        userHistories.delete(socket.id); // Clean up
    });

    socket.on("ai-message", async (data) => {
        try {
            const prompt = data?.prompt;

            if (!prompt || typeof prompt !== "string") {
                console.error("🚫 Invalid prompt received:", data);
                socket.emit("ai-message-response", {
                    response: "Invalid prompt. Please try again."
                });
                return;
            }

            console.log(`📩 [${socket.id}] User:`, prompt);

            // Get or initialize chat history for this socket
            const chatHistory = userHistories.get(socket.id) || [];

            // Add user message to history
            chatHistory.push({
                role: "user",
                parts: [{ text: prompt }]
            });

            // Call AI to get response
            const response = await generateResponse(chatHistory);

            // Validate response
            const aiText = typeof response === "string"
                ? response
                : (response?.text || "⚠️ AI returned an unexpected response.");

            // Add AI message to history
            chatHistory.push({
                role: "model",
                parts: [{ text: aiText }]
            });

            // Update stored history
            userHistories.set(socket.id, chatHistory);

            console.log(`🤖 [${socket.id}] AI:`, aiText);

            // Emit response back
            socket.emit("ai-message-response", { response: aiText });

        } catch (error) {
            console.error(`🔥 Error [${socket.id}]:`, error.message);
            socket.emit("ai-message-response", {
                response: "Oops! Something went wrong. Please try again."
            });
        }
    });
});

httpServer.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
