const { pool } = require("../config/db");

const findRule = async (schemeId) => {

    const query = `
        SELECT *
        FROM eligibility_rules
        WHERE scheme_id=$1
    `;

    const result = await pool.query(query,[schemeId]);

    return result.rows[0];

};

module.exports = {

    findRule

};