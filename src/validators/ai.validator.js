const validateAIChat = (req, res, next) => {

    const { message } = req.body;

    if (!message || message.trim() === "") {
        return res.status(400).json({

            success: false,

            message: "Message is required"

        });
    }

    next();

};

module.exports = {
    validateAIChat
};