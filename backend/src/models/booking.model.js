const db = require("../config/database");

async function createBooking(data) {
  const {
    user_id,
    car_id,
    start_datetime,
    end_datetime,
    base_price,
    final_price,
    customer_name,
    customer_email,
    customer_phone,
    pickup_location,
    dropoff_location,
    notes,
  } = data;

  const [result] = await db.query(`
    INSERT INTO bookings
    (
      user_id,
      car_id,
      start_datetime,
      end_datetime,
      base_price,
      final_price,
      customer_name,
      customer_email,
      customer_phone,
      pickup_location,
      dropoff_location,
      notes,
      status,
      payment_status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    user_id,
    car_id,
    start_datetime,
    end_datetime,
    base_price,
    final_price,
    customer_name,
    customer_email,
    customer_phone,
    pickup_location,
    dropoff_location,
    notes,
    "pending",
    "unpaid",
  ]);

  return result.insertId;
}

async function getBookings() {
  const [rows] = await db.query(`
    SELECT *
    FROM bookings
    ORDER BY created_at DESC
  `);

  return rows;
}

module.exports = {
  createBooking,
  getBookings,
};