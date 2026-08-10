const { pool } = require("../config/db");

const findAll = async () => {
  const query = `
    SELECT *
    FROM schemes
    ORDER BY scheme_name;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const findById = async (id) => {
  const query = `
    SELECT *
    FROM schemes
    WHERE id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const getRandomSchemes = async (limit = 5) => {

  const result = await pool.query(
    `
        SELECT
            id,
            scheme_code,
            scheme_name,
            department,
            state,
            description
        FROM schemes
        ORDER BY RANDOM()
        LIMIT $1
        `,
    [limit]
  );

  return result.rows;
};

const getStats = async () => {

  const result = await pool.query(`
        SELECT
            COUNT(*)::INTEGER AS "totalSchemes",
            COUNT(DISTINCT state)::INTEGER AS "totalStates",
            COUNT(DISTINCT department)::INTEGER AS "totalDepartments"
        FROM schemes;
    `);

  return result.rows[0];
};


module.exports = {
  findAll,
  findById,
  getRandomSchemes,
  getStats
};