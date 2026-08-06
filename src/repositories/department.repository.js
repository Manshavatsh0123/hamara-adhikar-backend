const { pool } = require("../config/db");

// Get all unique departments
const findAll = async () => {
    const query = `
        SELECT DISTINCT department
        FROM schemes
        ORDER BY department;
    `;

    const result = await pool.query(query);

    return result.rows;
};

// Get all schemes by department
const findByDepartment = async (department) => {
    const query = `
        SELECT
            id,
            scheme_code,
            scheme_name,
            department,
            state,
            description
        FROM schemes
        WHERE LOWER(department) = LOWER($1)
        ORDER BY scheme_name;
    `;

    const result = await pool.query(query, [department]);

    return result.rows;
};

module.exports = {
    findAll,
    findByDepartment
};