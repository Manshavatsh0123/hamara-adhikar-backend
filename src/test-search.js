const aiRepository = require("./repositories/ai.repository");


async function test(){

    try{

        const result = await aiRepository.searchSchemes(
            "I am a student from Bihar"
        );


        console.log("Search Result:");

        console.log(result);


    }
    catch(error){

        console.log(error.message);

    }

}


test();