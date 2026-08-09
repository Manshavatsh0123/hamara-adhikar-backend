const { pool } = require("../config/db");

const findRuleWithScheme = async (schemeId) => {

    const query = `
        SELECT
            er.id,
            er.scheme_id,
            er.min_age,
            er.max_age,
            er.gender,
            er.state,
            er.occupation,
            er.caste,
            er.income_limit,
            er.disability,

            s.scheme_name,
            s.department,
            s.state AS scheme_state,
            s.description

        FROM eligibility_rules er

        JOIN schemes s
            ON s.id = er.scheme_id

        WHERE er.scheme_id = $1

        LIMIT 1;
    `;

    const result = await pool.query(query, [schemeId]);

    return result.rows[0];
};

module.exports = {
    findRuleWithScheme
};