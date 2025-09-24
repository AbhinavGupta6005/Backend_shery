const {GoogleGenAI} = require("@google/genai");

const ai = new GoogleGenAI({})

async function generateResponse(content){
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents : content,
    }) 

    return response.text;
//     const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // Correct model name and call
//     const result = await model.generateContent({
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: promptText }],
//       }
//     ]
//   });
//     const response = await result.response;
//     const text = response.text();
//     return text; 
}

module.exports = {
    generateResponse
}