const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
} = require('../controllers/users');

router.get('/:userId', getUserById);
router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;
