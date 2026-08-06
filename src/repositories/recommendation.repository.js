const { pool } = require("../config/db");

const findAllSchemes = async () => {

    const query = `

        SELECT

            s.id,
            s.scheme_name,
            s.department,
            s.state,

            er.min_age,
            er.max_age,
            er.gender,
            er.state AS eligible_states,
            er.occupation,
            er.income_limit,
            er.caste,
            er.disability

        FROM schemes s

        LEFT JOIN eligibility_rules er
        ON s.id = er.scheme_id

        ORDER BY s.scheme_name;

    `;

    const result = await pool.query(query);

    return result.rows;

};

module.exports = {

    findAllSchemes

};