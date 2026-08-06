const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();


// GET /api/categories
router.get("/", categoryController.getAllCategories);

// GET /api/categories/:category
router.get("/:category", categoryController.getSchemesByCategory);

module.exports = router;