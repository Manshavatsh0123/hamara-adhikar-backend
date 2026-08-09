const { GoogleGenAI } = require("@google/genai");

const env = require("../config/env");

const aiRepository = require("../repositories/ai.repository");


const ai = new GoogleGenAI({

    apiKey: env.GEMINI_API_KEY

});



const chat = async(message)=>{


    // STEP 1: Retrieve schemes from PostgreSQL

    const schemes = await aiRepository.searchSchemes(message);


    console.log("Retrieved Schemes:", schemes);



    // STEP 2: Convert database result into AI context

    const context = schemes.map((scheme)=>{


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


    }).join("\n");




    // STEP 3: Create Gemini Prompt


    const prompt = `

You are Hamara Adhikar AI Assistant.

Help users find government schemes.

User Question:

${message}


Available Government Schemes:

${context}


Rules:

1. Understand normal human language.

Example:
"I am a student from Bihar"
means user wants student schemes in Bihar.

2. Explain relevant schemes.

3. Mention benefits and eligibility.

4. Use only provided database information.

5. If no relevant scheme exists say:
"No matching scheme found."


`;




    // STEP 4: Gemini response


    const response = await ai.models.generateContent({

        model:"gemini-flash-latest",

        contents:prompt

    });



    return {

        reply: response.text,

        sources: schemes

    };


};



module.exports = {

    chat

};