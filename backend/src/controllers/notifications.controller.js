const db = require("../config/db");

exports.getNotifications = async (
  req,
  res
) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.markRead = async (
  req,
  res
) => {
  try {
    await db.query(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ?
      `,
      [req.params.id]
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.markAllRead = async (
  req,
  res
) => {
  try {
    await db.query(
      `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ?
      `,
      [req.user.id]
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};