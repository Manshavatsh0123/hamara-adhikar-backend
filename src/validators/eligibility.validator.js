const validateEligibility = (req,res,next)=>{

    const {

        schemeId,
        age,
        gender,
        state,
        occupation,
        income,
        caste,
        disability

    } = req.body;

    if(!schemeId){

        return res.status(400).json({

            success:false,

            message:"schemeId is required"

        });

    }

    if(age===undefined){

        return res.status(400).json({

            success:false,

            message:"Age is required"

        });

    }

    if(!gender){

        return res.status(400).json({

            success:false,

            message:"Gender is required"

        });

    }

    next();

};

module.exports = {

    validateEligibility

};