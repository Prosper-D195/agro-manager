const bcrypt = require('bcryptjs');
const sequelize = require('../../src/config/database');
const User = require('../../src/models/user');
const { requireRole } = require('../../src/middleware/auth');

// GET /api/users - liste des utilisateurs (admin uniquement)
const getUsers = async (req, res) => {
  try {
    await requireRole(req, res, 'admin', async () => {
      const users = await User.findAll({
        attributes: ['id', 'email', 'role', 'created_at']
      });
      res.json(users);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users - création d’un utilisateur avec rôle
const createUser = async (req, res) => {
  try {
    await requireRole(req, res, 'admin', async () => {
      const { email, password, role } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ error: 'email, password et role sont requis' });
      }

      const rolesAllowed = ['admin', 'gestionnaire', 'operateur'];
      if (!rolesAllowed.includes(role)) {
        return res.status(400).json({ error: 'role invalide' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        email,
        password: hashedPassword,
        role
      });

      res.status(201).json({ message: 'Utilisateur créé', id: user.id });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/users/:id - modification du rôle
const updateUser = async (req, res) => {
  try {
    await requireRole(req, res, 'admin', async () => {
      const { id } = req.params;
      const { role } = req.body;

      const rolesAllowed = ['admin', 'gestionnaire', 'operateur'];
      if (!rolesAllowed.includes(role)) {
        return res.status(400).json({ error: 'role invalide' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      await user.update({ role });

      res.json({ message: 'Utilisateur modifié' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/users/:id - suppression
const deleteUser = async (req, res) => {
  try {
    await requireRole(req, res, 'admin', async () => {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      await user.destroy();

      res.json({ message: 'Utilisateur supprimé' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};