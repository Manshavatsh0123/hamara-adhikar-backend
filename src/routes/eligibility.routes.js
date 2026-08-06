const express = require("express");

const router = express.Router();

const eligibilityController = require("../controllers/eligibility.controller");
const eligibilityValidator=require("../validators/eligibility.validator");

// POST /api/eligibility
router.post(
    "/",
    eligibilityValidator.validateEligibility,
    eligibilityController.checkEligibility
);

module.exports = router;