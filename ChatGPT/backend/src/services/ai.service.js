const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

// 🤖 Generate text response from Gemini
async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
  });

  return response.text;
}

// 🧠 Generate embedding vector from Gemini
async function generateVector(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: { outputDimensionality: 1024 },
  });

  // ✅ return just the float array Pinecone expects
  return response.embeddings[0].values;
}

module.exports = {
  generateResponse,
  generateVector,
};
