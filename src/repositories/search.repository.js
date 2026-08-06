const { pool } = require("../config/db");

// Search schemes
const searchSchemes = async (keyword) => {

    const query = `
        SELECT DISTINCT
            s.id,
            s.scheme_code,
            s.scheme_name,
            s.department,
            s.state,
            s.description
        FROM schemes s

        LEFT JOIN scheme_categories sc
        ON s.id = sc.scheme_id

        LEFT JOIN scheme_tags st
        ON s.id = st.scheme_id

        WHERE

            s.scheme_name ILIKE $1
            OR s.description ILIKE $1
            OR s.search_text ILIKE $1
            OR sc.category ILIKE $1
            OR st.tag ILIKE $1

        ORDER BY s.scheme_name;
    `;

    const result = await pool.query(query, [`%${keyword}%`]);

    return result.rows;
};

// Search Suggestions
const searchSuggestions = async (keyword) => {

    const query = `
        SELECT DISTINCT
            scheme_name
        FROM schemes
        WHERE scheme_name ILIKE $1
        ORDER BY scheme_name
        LIMIT 10;
    `;

    const result = await pool.query(query, [`%${keyword}%`]);

    return result.rows;
};

module.exports = {
    searchSchemes,
    searchSuggestions
};