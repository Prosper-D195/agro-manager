const pool = require('../utils/db');
const bcrypt = require('bcrypt');

async function createUser({ name, email, password, role = 'lecteur' }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role;
  `;
  const result = await pool.query(query, [name, email, hashedPassword, role]);
  return result.rows[0];
}

async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

module.exports = { createUser, findUserByEmail };