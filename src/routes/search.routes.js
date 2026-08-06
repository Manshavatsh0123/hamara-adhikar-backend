const express = require("express");

const router = express.Router();

const searchController = require("../controllers/search.controller");

// Search suggestions
router.get("/suggestions", searchController.getSuggestions);

// Search schemes
router.get("/", searchController.searchSchemes);

module.exports = router;