const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

async function generateResponse(prompt){
    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt, 
    })

    return response.text;
}

// await main();

module.exports = generateResponse;