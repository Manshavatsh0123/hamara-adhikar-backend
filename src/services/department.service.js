const departmentRepository = require("../repositories/department.repository");

const getAllDepartments = async () => {
    return await departmentRepository.findAll();
};

const getSchemesByDepartment = async (department) => {
    return await departmentRepository.findByDepartment(department);
};

module.exports = {
    getAllDepartments,
    getSchemesByDepartment
};