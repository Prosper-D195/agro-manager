const express = require('express');
const pool = require('../utils/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

/// --- Catégories ---

// GET /api/compta/categories
router.get('/categories', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nom, type, description, created_at, updated_at FROM categories_comptables ORDER BY type, nom'
    );
    res.json(rows);
  } catch (err) {
    console.error('get-categories error:', err);
    res.status(500).json({
      message: 'Erreur lors de la récupération des catégories',
      error: err.message
    });
  }
});

// POST /api/compta/categories
router.post('/categories', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { nom, type, description } = req.body;

    if (!nom || !type) {
      return res.status(400).json({ message: 'nom et type sont obligatoires' });
    }
    if (type !== 'PRODUIT' && type !== 'CHARGE') {
      return res.status(400).json({ message: 'type doit être PRODUIT ou CHARGE' });
    }

    const { rows } = await pool.query(
      'INSERT INTO categories_comptables (nom, type, description) VALUES ($1, $2, $3) RETURNING id, nom, type, description, created_at, updated_at',
      [nom, type, description || null]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('create-category error:', err);
    res.status(500).json({
      message: 'Erreur lors de la création de la catégorie',
      error: err.message
    });
  }
});

// PUT /api/compta/categories/:id
router.put('/categories/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, type, description } = req.body;

    if (!nom || !type) {
      return res.status(400).json({ message: 'nom et type sont obligatoires' });
    }
    if (type !== 'PRODUIT' && type !== 'CHARGE') {
      return res.status(400).json({ message: 'type doit être PRODUIT ou CHARGE' });
    }

    const { rows } = await pool.query(
      'UPDATE categories_comptables SET nom = $1, type = $2, description = $3, updated_at = NOW() WHERE id = $4 RETURNING id, nom, type, description, created_at, updated_at',
      [nom, type, description || null, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('update-category error:', err);
    res.status(500).json({
      message: 'Erreur lors de la modification de la catégorie',
      error: err.message
    });
  }
});

// DELETE /api/compta/categories/:id
router.delete('/categories/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'DELETE FROM categories_comptables WHERE id = $1 RETURNING id',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    console.error('delete-category error:', err);
    res.status(500).json({
      message: 'Erreur lors de la suppression de la catégorie',
      error: err.message
    });
  }
});

/// --- Opérations ---

// GET /api/compta/operations
router.get('/operations', authenticate, async (req, res) => {
  try {
    const {
      type,
      categorie_id,
      culture_id,
      recolte_id,
      intrant_id,
      start_date,
      end_date
    } = req.query;

    let sql = `
      SELECT o.id,
             o.type,
             o.date,
             o.libelle,
             o.montant,
             o.mode_paiement,
             o.commentaire,
             o.categorie_id,
             c.nom AS categorie_nom,
             c.type AS categorie_type,
             o.culture_id,
             o.culture_nom,
             o.recolte_id,
             o.recolte_nom,
             o.intrant_id,
             o.intrant_nom
      FROM operations_comptables o
      JOIN categories_comptables c ON o.categorie_id = c.id
    `;

    const conditions = [];
    const params = [];

    if (type) {
      conditions.push('o.type = $' + (params.length + 1));
      params.push(type);
    }
    if (categorie_id) {
      conditions.push('o.categorie_id = $' + (params.length + 1));
      params.push(categorie_id);
    }
    if (culture_id) {
      conditions.push('o.culture_id = $' + (params.length + 1));
      params.push(culture_id);
    }
    if (recolte_id) {
      conditions.push('o.recolte_id = $' + (params.length + 1));
      params.push(recolte_id);
    }
    if (intrant_id) {
      conditions.push('o.intrant_id = $' + (params.length + 1));
      params.push(intrant_id);
    }
    if (start_date) {
      conditions.push('o.date >= $' + (params.length + 1));
      params.push(start_date);
    }
    if (end_date) {
      conditions.push('o.date <= $' + (params.length + 1));
      params.push(end_date);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY o.date DESC, o.id DESC';

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('get-operations error:', err);
    res.status(500).json({
      message: 'Erreur lors de la récupération des opérations',
      error: err.message
    });
  }
});

// POST /api/compta/operations
router.post('/operations', authenticate, requireRole('admin', 'gestionnaire', 'operateur'), async (req, res) => {
  try {
    const {
      type,
      date,
      libelle,
      montant,
      categorie_id,
      mode_paiement,
      culture_id,
      culture_nom,
      recolte_id,
      recolte_nom,
      intrant_id,
      intrant_nom,
      commentaire
    } = req.body;

    if (!type || !libelle || montant == null || !categorie_id) {
      return res.status(400).json({
        message: 'type, libelle, montant et categorie_id sont obligatoires'
      });
    }
    if (type !== 'RECETTE' && type !== 'DEPENSE') {
      return res.status(400).json({ message: 'type doit être RECETTE ou DEPENSE' });
    }
    if (Number(montant) <= 0) {
      return res.status(400).json({ message: 'montant doit être > 0' });
    }

    const { rows } = await pool.query(
      `INSERT INTO operations_comptables
       (type, date, libelle, montant, categorie_id, mode_paiement,
        culture_id, culture_nom, recolte_id, recolte_nom, intrant_id, intrant_nom, commentaire)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id, type, date, libelle, montant, categorie_id, mode_paiement,
                 culture_id, culture_nom, recolte_id, recolte_nom, intrant_id, intrant_nom, commentaire`,
      [
        type,
        date || new Date(),
        libelle,
        montant,
        categorie_id,
        mode_paiement || null,
        culture_id || null,
        culture_nom || null,
        recolte_id || null,
        recolte_nom || null,
        intrant_id || null,
        intrant_nom || null,
        commentaire || null
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('create-operation error:', err);
    res.status(500).json({
      message: 'Erreur lors de la création de l’opération',
      error: err.message
    });
  }
});

// PUT /api/compta/operations/:id
router.put('/operations/:id', authenticate, requireRole('admin', 'gestionnaire', 'operateur'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      date,
      libelle,
      montant,
      categorie_id,
      mode_paiement,
      culture_id,
      culture_nom,
      recolte_id,
      recolte_nom,
      intrant_id,
      intrant_nom,
      commentaire
    } = req.body;

    if (!type || !libelle || montant == null || !categorie_id) {
      return res.status(400).json({
        message: 'type, libelle, montant et categorie_id sont obligatoires'
      });
    }
    if (type !== 'RECETTE' && type !== 'DEPENSE') {
      return res.status(400).json({ message: 'type doit être RECETTE ou DEPENSE' });
    }
    if (Number(montant) <= 0) {
      return res.status(400).json({ message: 'montant doit être > 0' });
    }

    const { rows } = await pool.query(
      `UPDATE operations_comptables
       SET type = $1,
           date = $2,
           libelle = $3,
           montant = $4,
           categorie_id = $5,
           mode_paiement = $6,
           culture_id = $7,
           culture_nom = $8,
           recolte_id = $9,
           recolte_nom = $10,
           intrant_id = $11,
           intrant_nom = $12,
           commentaire = $13,
           updated_at = NOW()
       WHERE id = $14
       RETURNING id, type, date, libelle, montant, categorie_id, mode_paiement,
                 culture_id, culture_nom, recolte_id, recolte_nom, intrant_id, intrant_nom, commentaire`,
      [
        type,
        date || new Date(),
        libelle,
        montant,
        categorie_id,
        mode_paiement || null,
        culture_id || null,
        culture_nom || null,
        recolte_id || null,
        recolte_nom || null,
        intrant_id || null,
        intrant_nom || null,
        commentaire || null,
        id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Opération non trouvée' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('update-operation error:', err);
    res.status(500).json({
      message: 'Erreur lors de la modification de l’opération',
      error: err.message
    });
  }
});

// DELETE /api/compta/operations/:id
router.delete('/operations/:id', authenticate, requireRole('admin', 'gestionnaire'), async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'DELETE FROM operations_comptables WHERE id = $1 RETURNING id',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Opération non trouvée' });
    }

    res.json({ message: 'Opération supprimée' });
  } catch (err) {
    console.error('delete-operation error:', err);
    res.status(500).json({
      message: 'Erreur lors de la suppression de l’opération',
      error: err.message
    });
  }
});

/// --- Dashboard financier ---

// GET /api/compta/dashboard
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let where = '';
    if (start_date || end_date) {
      where = 'WHERE ';
      if (start_date && end_date) {
        where += 'date >= $1 AND date <= $2';
      } else if (start_date) {
        where += 'date >= $1';
      } else if (end_date) {
        where += 'date <= $1';
      }
    }

    const params = [];
    if (start_date) params.push(start_date);
    if (end_date) params.push(end_date);

    const { rows: totals } = await pool.query(
      `SELECT
         SUM(montant) FILTER (WHERE type = 'RECETTE') AS total_recettes,
         SUM(montant) FILTER (WHERE type = 'DEPENSE') AS total_depenses
       FROM operations_comptables
       ${where}`,
      params
    );

    const totalRecettes = totals[0].total_recettes || 0;
    const totalDepenses = totals[0].total_depenses || 0;
    const resultat = totalRecettes - totalDepenses;

    const { rows: byCategory } = await pool.query(
      `SELECT c.id, c.nom, c.type,
              SUM(o.montant) AS total
       FROM operations_comptables o
       JOIN categories_comptables c ON o.categorie_id = c.id
       ${where}
       GROUP BY c.id, c.nom, c.type
       ORDER BY c.type, total DESC`,
      params
    );

    res.json({
      total_recettes: Number(totalRecettes),
      total_depenses: Number(totalDepenses),
      resultat: Number(resultat),
      by_category: byCategory
    });
  } catch (err) {
    console.error('dashboard-compta error:', err);
    res.status(500).json({
      message: 'Erreur lors du calcul du dashboard financier',
      error: err.message
    });
  }
});

module.exports = router;