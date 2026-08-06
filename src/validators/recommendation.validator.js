const validateRecommendation = (req, res, next) => {

    const {

        age,

        gender,

        state,

        occupation,

        income,

        caste,

        disability

    } = req.body;

    if (age === undefined) {

        return res.status(400).json({

            success: false,

            message: "Age is required"

        });

    }

    if (!gender) {

        return res.status(400).json({

            success: false,

            message: "Gender is required"

        });

    }

    if (!state) {

        return res.status(400).json({

            success: false,

            message: "State is required"

        });

    }

    if (!occupation) {

        return res.status(400).json({

            success: false,

            message: "Occupation is required"

        });

    }

    if (income === undefined) {

        return res.status(400).json({

            success: false,

            message: "Income is required"

        });

    }

    if (!caste) {

        return res.status(400).json({

            success: false,

            message: "Caste is required"

        });

    }

    if (disability === undefined) {

        return res.status(400).json({

            success: false,

            message: "Disability is required"

        });

    }

    next();

};

module.exports = {
    validateRecommendation
};