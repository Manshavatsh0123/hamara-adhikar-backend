const departmentService = require("../services/department.service");

// GET /api/departments
const getAllDepartments = async (req, res) => {
    try {

        const departments = await departmentService.getAllDepartments();

        res.status(200).json({
            success: true,
            count: departments.length,
            data: departments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// GET /api/departments/:department
const getSchemesByDepartment = async (req, res) => {
    try {

        const { department } = req.params;

        const schemes = await departmentService.getSchemesByDepartment(department);

        if (schemes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No schemes found for this department"
            });
        }

        res.status(200).json({
            success: true,
            count: schemes.length,
            data: schemes
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getAllDepartments,
    getSchemesByDepartment
};