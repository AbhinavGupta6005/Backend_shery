const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({});


async function generateResponse(chatHistory){
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: chatHistory, 
    })

    return response.text;
}


module.exports = generateResponse;