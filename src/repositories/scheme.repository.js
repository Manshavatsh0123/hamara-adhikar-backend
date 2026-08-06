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

module.exports = {
  findAll,
};