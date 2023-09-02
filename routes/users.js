const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateAvatarById,
  updateUserById,
} = require('../controllers/users');

router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateUserById);
router.patch('/me/avatar', updateAvatarById);

module.exports = router;
