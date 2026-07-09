const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { requireRole } = require('../../src/middleware/auth');

router.get('/users', requireRole('admin'), userController.getUsers);
router.post('/users', requireRole('admin'), userController.createUser);
router.put('/users/:id', requireRole('admin'), userController.updateUser);
router.delete('/users/:id', requireRole('admin'), userController.deleteUser);

module.exports = router;