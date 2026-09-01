const db = require("../config/database");

class Ticket {

  static async create(ticketData) {

    const {
      user_id,
      booking_id,
      subject,
      message,
      priority = "normal",
      status = "open",
    } = ticketData;

    const ticketRef =
      "TKT" +
      Date.now() +
      Math.floor(Math.random() * 1000);

    const [result] = await db.query(
      `
      INSERT INTO tickets
      (
        ticket_reference,
        user_id,
        booking_id,
        subject,
        message,
        priority,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        ticketRef,
        user_id || null,
        booking_id || null,
        subject,
        message,
        priority,
        status,
      ]
    );

    return {
      id: result.insertId,
      ticket_reference: ticketRef,
    };
  }

  static async findById(id) {

    const [rows] = await db.query(
      `
      SELECT
        t.*,
        u.email as user_email,
        u.first_name,
        u.last_name,
        b.booking_reference
      FROM tickets t
      LEFT JOIN users u
        ON t.user_id = u.id
      LEFT JOIN bookings b
        ON t.booking_id = b.id
      WHERE t.id = ?
      `,
      [id]
    );

    return rows[0];
  }

  static async findByUser(userId) {

    const [rows] = await db.query(
      `
      SELECT
        t.*,
        b.booking_reference
      FROM tickets t
      LEFT JOIN bookings b
        ON t.booking_id = b.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
      `,
      [userId]
    );

    return rows;
  }

  static async getAll(
    filters = {},
    limit = 100,
    offset = 0
  ) {

    let sql = `
      SELECT
        t.*,
        u.email as user_email,
        b.booking_reference
      FROM tickets t
      LEFT JOIN users u
        ON t.user_id = u.id
      LEFT JOIN bookings b
        ON t.booking_id = b.id
      WHERE 1=1
    `;

    const params = [];

    if (filters.status) {
      sql += " AND t.status = ?";
      params.push(filters.status);
    }

    sql += `
      ORDER BY t.created_at DESC
      LIMIT ?
      OFFSET ?
    `;

    params.push(limit);
    params.push(offset);

    const [rows] = await db.query(
      sql,
      params
    );

    return rows;
  }

  static async updateStatus(
    id,
    status
  ) {

    await db.query(
      `
      UPDATE tickets
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    return true;
  }

  static async addReply(
    ticketId,
    userId,
    message,
    isStaff = false
  ) {

    const [result] = await db.query(
      `
      INSERT INTO ticket_messages
      (
        ticket_id,
        user_id,
        message,
        is_staff,
        created_at
      )
      VALUES (?, ?, ?, ?, NOW())
      `,
      [
        ticketId,
        userId,
        message,
        isStaff ? 1 : 0,
      ]
    );

    await this.updateStatus(
      ticketId,
      "in_progress"
    );

    return result.insertId;
  }

  static async getReplies(ticketId) {

    const [rows] = await db.query(
      `
      SELECT
        tm.*,
        u.first_name,
        u.last_name,
        u.role
      FROM ticket_messages tm
      LEFT JOIN users u
        ON tm.user_id = u.id
      WHERE tm.ticket_id = ?
      ORDER BY tm.created_at ASC
      `,
      [ticketId]
    );

    return rows;
  }
}

module.exports = Ticket;