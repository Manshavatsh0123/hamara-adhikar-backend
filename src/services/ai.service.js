
const { GoogleGenAI } = require("@google/genai");

const env = require("../config/env");
const aiRepository = require("../repositories/ai.repository");

const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
});


const generateWithFallback = async (prompt) => {
    const models = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
    ];

    let lastError = null;

    for (const model of models) {
        try {
            console.log(`Trying model: ${model}`);

            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            });

            console.log(
                `Gemini response received from: ${model}`
            );

            return response;

        } catch (error) {
            lastError = error;

            console.error(`Model ${model} failed`, {
                status: error.status,
                message: error.message,
                model,
            });

            // Rate limit / quota
            if (error.status === 429) {
                console.error(
                    `Gemini rate limit reached for ${model}`
                );

                throw error;
            }

            // Temporary server/model availability issue
            if (error.status === 503) {
                console.log(
                    `${model} unavailable. Trying fallback model...`
                );

                continue;
            }

            // Any other error should not be hidden
            throw error;
        }
    }

    throw lastError;
};



const chat = async (message) => {

    // --------------------------------
    // 1. Search schemes
    // --------------------------------

    const schemes =
        await aiRepository.searchSchemes(message);


    console.log(
        "Retrieved Schemes:",
        schemes
    );


    // --------------------------------
    // 2. Create AI context
    // --------------------------------

    const context = schemes
        .map((scheme) => {

            return `
Scheme Name:
${scheme.scheme_name}

Department:
${scheme.department}

State:
${scheme.state}

Description:
${scheme.description}
`;

        })
        .join("\n");

    const prompt = `
You are Sahay Bihar AI Assistant.

Your job is to help citizens find relevant government schemes
available in Bihar.

User Question:

${message}


Available Government Schemes:

${context}


Rules:

1. Understand normal human language.

2. Identify the government schemes relevant
   to the user's situation.

3. Explain the relevant schemes clearly.

4. Mention benefits only when they are available
   in the provided database information.

5. Mention eligibility only when it is available
   in the provided database information.

6. Never invent information.

7. Use ONLY the provided database information.

8. If no relevant scheme exists, say:

"No matching scheme found."

9. Keep the response simple, clear and helpful
   for an ordinary citizen.

10. Do not introduce yourself unnecessarily.
`;

    const response =
        await generateWithFallback(prompt);


    return {

        reply: response.text,

        sources: schemes,

    };

};


module.exports = {
    chat,
};


// const aiRepository = require("../repositories/ai.repository");

// const chat = async (message) => {
//     // --------------------------------
//     // 1. Search schemes from database
//     // --------------------------------

//     const schemes =
//         await aiRepository.searchSchemes(message);

//     console.log(
//         "Retrieved Schemes:",
//         schemes
//     );


//     // --------------------------------
//     // 2. Create simple response
//     // --------------------------------

//     let reply = "";

//     if (!schemes || schemes.length === 0) {

//         reply =
//             "No matching scheme found.";

//     } else {

//         reply =
//             "Here are the government schemes that may be relevant to you.";
//     }


//     // --------------------------------
//     // 3. Return database results
//     // --------------------------------

//     return {
//         reply,
//         sources: schemes,
//     };
// };


// module.exports = {
//     chat,
// };
