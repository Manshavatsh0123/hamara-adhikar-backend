const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// const { Pool } = require("pg");
// const env = require("./env");

// const pool = new Pool({
//   host: env.DB_HOST,
//   port: env.DB_PORT,
//   user: env.DB_USER,
//   password: env.DB_PASSWORD,
//   database: env.DB_NAME,
// });

// // Function to verify database connection
// const connectDB = async () => {
//   try {
//     const client = await pool.connect();

//     console.log("PostgreSQL connected successfully");

//     client.release();
//   } catch (error) {
//     console.error("PostgreSQL connection failed");
//     console.error(error.message);

//     process.exit(1);
//   }
// };

// module.exports = {
//   pool,
//   connectDB,
// };