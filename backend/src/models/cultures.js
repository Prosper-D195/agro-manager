const pool = require('../utils/db');

async function createCulture({ name, category }) {
  const query = `
    INSERT INTO cultures (name, category)
    VALUES ($1, $2)
    RETURNING id, name, category, created_at;
  `;
  const result = await pool.query(query, [name, category || null]);
  return result.rows[0];
}

async function getCultures() {
  const query = `
    SELECT id, name, category, created_at
    FROM cultures
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function updateCulture(id, { name, category }) {
  const query = `
    UPDATE cultures
    SET name = $1, category = $2
    WHERE id = $3
    RETURNING id, name, category, created_at;
  `;
  const result = await pool.query(query, [name, category || null, id]);
  return result.rows[0];
}

async function deleteCulture(id) {
  const query = `DELETE FROM cultures WHERE id = $1 RETURNING id;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

module.exports = { createCulture, getCultures, updateCulture, deleteCulture };