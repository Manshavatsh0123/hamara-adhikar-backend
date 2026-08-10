const express = require("express");

const router = express.Router();

const schemeController =
    require("../controllers/scheme.controller");

router.get("/", schemeController.getStats);

module.exports = router;