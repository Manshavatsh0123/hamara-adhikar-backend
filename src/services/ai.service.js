const { GoogleGenAI } = require("@google/genai");
const env = require("../config/env");


const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY
});


const chat = async (message) => {

    const response = await ai.models.generateContent({

        model: "gemini-flash-latest",

        contents: message

    });


    return {
        reply: response.text
    };

};


module.exports = {
    chat
};