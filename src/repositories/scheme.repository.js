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


module.exports = {
  findAll,
  findById,
};