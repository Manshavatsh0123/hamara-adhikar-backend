const aiService = require("../services/ai.service");


const chat = async (req, res) => {

    try {

        const { message } = req.body;
        const response = await aiService.chat(message);
        res.status(200).json({

            success: true,
            data: response

        });


    } catch (error) {


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {
    chat
};