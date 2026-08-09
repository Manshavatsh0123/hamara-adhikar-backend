const extractKeywords = async(message)=>{


    message = message.toLowerCase();


    let keywords=[];


    // Bihar detection

    if(message.includes("bihar")){
        keywords.push("bihar");
    }



    // Student detection

    if(
        message.includes("student") ||
        message.includes("study") ||
        message.includes("college") ||
        message.includes("education")
    ){

        keywords.push("student");
        keywords.push("education");

    }



    // Farmer

    if(
        message.includes("farmer") ||
        message.includes("agriculture") ||
        message.includes("kisan")
    ){

        keywords.push("farmer");
        keywords.push("agriculture");

    }



    // Girl/Women

    if(
        message.includes("girl") ||
        message.includes("women") ||
        message.includes("female")
    ){

        keywords.push("girl");
        keywords.push("women");

    }



    return keywords.join(" ");

};



module.exports={
    extractKeywords
};