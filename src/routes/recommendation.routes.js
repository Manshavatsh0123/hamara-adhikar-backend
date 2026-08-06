const express = require("express");

const router = express.Router();

const recommendationController =
require("../controllers/recommendation.controller");

const recommendationValidator =
require("../validators/recommendation.validator");

// POST /api/recommendations

router.post(

    "/",

    recommendationValidator.validateRecommendation,

    recommendationController.getRecommendations

);

module.exports = router;