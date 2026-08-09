const express = require("express");

const router = express.Router();

const {
    getApplication
} = require("../controllers/application.controller");

router.get(
    "/schemes/:id/application",
    getApplication
);

module.exports = router;