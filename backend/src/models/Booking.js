const db = require("../config/database");

class Booking {

  static async create(data) {

    const {
      user_id,
      car_id,
      customer_name,
      customer_email,
      customer_phone,
      pickup_location,
      dropoff_location,
      pickup_date,
      return_date,
      total_amount,
      addons,
      payment_status,
    } = data;

    const booking_reference =
      "AM38-" +
      Date.now();

    const [result] = await db.execute(
      `
      INSERT INTO bookings (
        user_id,
        car_id,
        booking_reference,
        customer_name,
        customer_email,
        customer_phone,
        pickup_location,
        dropoff_location,
        pickup_date,
        return_date,
        total_amount,
        addons,
        payment_status,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        car_id,
        booking_reference,
        customer_name,
        customer_email,
        customer_phone,
        pickup_location,
        dropoff_location,
        pickup_date,
        return_date,
        total_amount,
        JSON.stringify(addons || []),
        payment_status || "unpaid",
        "pending",
      ]
    );

    return result.insertId;
  }

  static async getAll() {

    const [rows] = await db.execute(`
      SELECT
        b.*,
        c.make,
        c.model,
        c.av_group,
        c.plate_number
      FROM bookings b
      LEFT JOIN cars c
      ON b.car_id = c.id
      ORDER BY b.created_at DESC
    `);

    return rows;
  }

  static async getById(id) {

    const [rows] = await db.execute(
      `
      SELECT
        b.*,
        c.make,
        c.model,
        c.av_group,
        c.plate_number
      FROM bookings b
      LEFT JOIN cars c
      ON b.car_id = c.id
      WHERE b.id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0];
  }

  static async updateStatus(
    id,
    status
  ) {

    await db.execute(
      `
      UPDATE bookings
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );
  }
}

module.exports = Booking;