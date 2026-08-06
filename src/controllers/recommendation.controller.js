const recommendationService = require("../services/recommendation.service");

const getRecommendations = async (req, res) => {

    try {

        const recommendations =
            await recommendationService.getRecommendations(req.body);

        res.status(200).json({

            success: true,

            count: recommendations.length,

            data: recommendations

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

module.exports = {

    getRecommendations

};