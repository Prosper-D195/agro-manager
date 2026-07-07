const express = require('express');
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  deleteOne
} = require('../controllers/intrants');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', requireRole('admin', 'gestionnaire'), create);
router.put('/:id', requireRole('admin', 'gestionnaire'), update);
router.delete('/:id', requireRole('admin', 'gestionnaire'), deleteOne);

module.exports = router;