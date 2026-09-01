const db = require("../config/database");

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      full_name,
      email,
      password AS password_hash,
      phone,
      role,
      provider,
      created_at,
      updated_at
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    `
    SELECT
      id,
      full_name,
      email,
      password AS password_hash,
      phone,
      role,
      provider,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};

exports.create = async (data) => {
  const {
    full_name,
    email,
    password_hash,
    phone,
    role,
    provider,
  } = data;

  const [result] = await db.query(
    `
    INSERT INTO users (
      full_name,
      email,
      password,
      phone,
      role,
      provider
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      full_name,
      email,
      password_hash,
      phone || null,
      role || "user",
      provider || "local",
    ]
  );

  return result.insertId;
};