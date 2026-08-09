const aiRepository = require("./repositories/ai.repository");


const test = async()=>{


const data =
await aiRepository.searchSchemes("student");


console.log(data);


process.exit();

};


test();