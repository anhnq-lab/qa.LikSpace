const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get client, or use specific list method if available in this SDK version
        // The SDK might not have a direct listModels on the client instance in older versions, 
        // but usually it exposes a model manager or we can try a simple generation to test.

        // Actually, newer SDKs don't have listModels directly on top level sometimes, 
        // but let's try to just test a few common model names.

        const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];

        console.log("Testing models with provided API key...");

        for (const m of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Test");
                console.log(`✅ Model ${m} is WORKING.`);
                return; // Found one!
            } catch (e) {
                console.log(`❌ Model ${m} failed: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
