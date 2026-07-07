const pool = require('../utils/db');

async function createRecolte({ culture_id, date_recolte, quantite, unite, notes }) {
  const query = `
    INSERT INTO recoltes (culture_id, date_recolte, quantite, unite, notes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, culture_id, date_recolte, quantite, unite, notes, created_at;
  `;
  const result = await pool.query(query, [
    culture_id,
    date_recolte,
    quantite,
    unite,
    notes || null
  ]);
  return result.rows[0];
}

async function getRecoltes() {
  const query = `
    SELECT r.id, r.culture_id, c.name AS culture_name, r.date_recolte, r.quantite, r.unite, r.notes, r.created_at
    FROM recoltes r
    JOIN cultures c ON c.id = r.culture_id
    ORDER BY r.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function updateRecolte(id, { culture_id, date_recolte, quantite, unite, notes }) {
  const query = `
    UPDATE recoltes
    SET culture_id = $1, date_recolte = $2, quantite = $3, unite = $4, notes = $5
    WHERE id = $6
    RETURNING id, culture_id, date_recolte, quantite, unite, notes, created_at;
  `;
  const result = await pool.query(query, [
    culture_id,
    date_recolte,
    quantite,
    unite,
    notes || null,
    id
  ]);
  return result.rows[0];
}

async function deleteRecolte(id) {
  const query = `DELETE FROM recoltes WHERE id = $1 RETURNING id;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

module.exports = { createRecolte, getRecoltes, updateRecolte, deleteRecolte };