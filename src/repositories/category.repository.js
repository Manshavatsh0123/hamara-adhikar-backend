const { pool } = require("../config/db");

const findAll = async () => {
  const query = `
      SELECT DISTINCT category
      FROM scheme_categories
      ORDER BY category;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const findByCategory = async (category) => {
  const query = `
      SELECT
          s.id,
          s.scheme_code,
          s.scheme_name,
          s.department,
          s.state,
          s.description
      FROM schemes s
      INNER JOIN scheme_categories sc
      ON s.id = sc.scheme_id
      WHERE LOWER(sc.category) = LOWER($1)
      ORDER BY s.scheme_name;
  `;

  const result = await pool.query(query, [category]);

  return result.rows;
};


module.exports = {
  findAll,
  findByCategory
};