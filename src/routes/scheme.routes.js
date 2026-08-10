const express = require("express");
const schemeController = require("../controllers/scheme.controller");


const router = express.Router();

router.get("/", schemeController.getAllSchemes);

router.get("/random", schemeController.getRandomSchemes);

router.get("/:id", schemeController.getSchemeById);

module.exports = router;