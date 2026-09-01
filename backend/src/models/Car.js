const db = require("../config/database");

class Car {
  static async getAll() {
    const [rows] = await db.execute(`
      SELECT *
      FROM cars
      ORDER BY id DESC
    `);

    return rows;
  }

  static async getById(id) {
    const [rows] = await db.execute(
      `
      SELECT *
      FROM cars
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0];
  }
}

module.exports = Car;