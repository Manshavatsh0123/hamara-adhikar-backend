const express = require("express");
const schemeController = require("../controllers/scheme.controller");


const router = express.Router();

router.get("/", schemeController.getAllSchemes);

module.exports = router;