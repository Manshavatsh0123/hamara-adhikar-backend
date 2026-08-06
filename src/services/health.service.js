const { pool } = require("../config/db");

const checkHealth = async () => {
  const result = await pool.query("SELECT NOW()");

  return {
    success: true,
    status: "UP",
    database: "Connected",
    timestamp: result.rows[0].now,
  };
};

module.exports = {
  checkHealth,
};