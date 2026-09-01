const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "carrent_pro",

  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

pool.getConnection()
  .then((connection) => {
    console.log("✅ MySQL Connected");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed");
    console.error(err.message);
  });

module.exports = pool;