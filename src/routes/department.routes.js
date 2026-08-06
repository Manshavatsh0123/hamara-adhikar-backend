const express = require("express");

const router = express.Router();

const departmentController = require("../controllers/department.controller");

// GET /api/departments
router.get("/", departmentController.getAllDepartments);

// GET /api/departments/:department
router.get("/:department", departmentController.getSchemesByDepartment);

module.exports = router;