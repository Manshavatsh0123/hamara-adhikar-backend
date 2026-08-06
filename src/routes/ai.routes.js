const express = require("express");

const router = express.Router();

const aiController = require("../controllers/ai.controller");

const aiValidator = require("../validators/ai.validator");

router.post(

    "/chat",

    aiValidator.validateAIChat,

    aiController.chat

);

module.exports = router;