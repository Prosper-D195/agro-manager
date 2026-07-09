const bcrypt = require('bcryptjs');
const sequelize = require('../../src/config/database');
const User = require('../../src/models/user');


// GET /api/users - liste des utilisateurs (admin uniquement)
const getUsers = async (req, res) => {
  console.log("getUsers called");
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role']
    });
    console.log("getUsers: users =", users);
    res.json(users);
  } catch (err) {
    console.log("getUsers: error =", err.message);
    res.status(500).json({ error: err.message });
  }
};


// POST /api/users - création d’un utilisateur avec rôle
const createUser = async (req, res) => {
  console.log("createUser called");
  try {
    const { email, password, role, name } = req.body;


    if (!email || !password || !role) {
      return res.status(400).json({ error: 'email, password et role sont requis' });
    }


    const rolesAllowed = ['admin', 'gestionnaire', 'operateur'];
    if (!rolesAllowed.includes(role)) {
      return res.status(400).json({ error: 'role invalide' });
    }


    const hashedPassword = await bcrypt.hash(password, 12);

    // name optionnel : si pas fourni, utiliser email
    const userName = name || email;


    const user = await User.create({
      name: userName,
      email,
      password: hashedPassword,
      role
    });


    res.status(201).json({ message: 'Utilisateur créé', id: user.id });
  } catch (err) {
    console.log("createUser: error =", err.message);
    res.status(500).json({ error: err.message });
  }
};


// PUT /api/users/:id - modification du rôle
const updateUser = async (req, res) => {
  console.log("updateUser called");
  try {
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
  } catch (err) {
    console.log("updateUser: error =", err.message);
    res.status(500).json({ error: err.message });
  }
};


// DELETE /api/users/:id - suppression
const deleteUser = async (req, res) => {
  console.log("deleteUser called");
  try {
    const { id } = req.params;


    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }


    await user.destroy();


    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.log("deleteUser: error =", err.message);
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};