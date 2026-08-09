const { pool } = require("../config/db");

const getApplicationInfo = async (schemeId) => {

    const query = `
        SELECT
            s.id,
            s.scheme_name,
            sc.application_process,
            sc.documents_required,
            sc.official_source

        FROM schemes s

        JOIN scheme_content sc
            ON s.id = sc.scheme_id

        WHERE s.id = $1;
    `;

    const result = await pool.query(query, [schemeId]);

    return result.rows[0];
};

module.exports = {
    getApplicationInfo
};