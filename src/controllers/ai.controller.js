const aiService = require("../services/ai.service");


const chat = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                message: "Message is required",
            });

        }


        const response = await aiService.chat(message);


        return res.status(200).json({

            success: true,

            data: response,

        });


    } catch (error) {

        console.error("AI Controller Error:", error);


        const statusCode =
            error.status === 503
                ? 503
                : error.status === 429
                    ? 429
                    : 500;


        return res.status(statusCode).json({

            success: false,

            message:
                statusCode === 503
                    ? "AI service is temporarily unavailable. Please try again shortly."
                    : statusCode === 429
                        ? "AI request limit reached. Please try again shortly."
                        : "Something went wrong while processing your request.",

        });

    }

};


module.exports = {
    chat,
};