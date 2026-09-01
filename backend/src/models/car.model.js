const db = require("../config/database");

async function getAllCars() {
  const [rows] = await db.query(`
    SELECT *
    FROM cars
    ORDER BY id DESC
  `);

  return rows;
}

async function getCarById(id) {
  const [rows] = await db.query(`
    SELECT *
    FROM cars
    WHERE id = ?
    LIMIT 1
  `, [id]);

  return rows[0];
}

module.exports = {
  getAllCars,
  getCarById,
};