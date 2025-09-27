// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const cohortChatGptIndex = pc.Index("chatgpt")

async function createMemory({vector, metadata, messageId}){

    await cohortChatGptIndex.upsert([{
        id: messageId,
        values: vector,
        metadata
    }])
}


async function queryMemory({queryVector, limit = 5, metadata}){

    const data = await cohortChatGptIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? {metadata}: undefined,
        includeMetadata: true
    })

    return data.matches
}


module.exports = {
    createMemory,
    queryMemory
}