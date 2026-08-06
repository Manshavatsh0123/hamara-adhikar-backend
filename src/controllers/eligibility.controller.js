const eligibilityService = require("../services/eligibility.service");

const checkEligibility = async (req, res) => {

    try {

        const result = await eligibilityService.checkEligibility(req.body);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    checkEligibility
};