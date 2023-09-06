const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  createUser,
  getUserById,
  updateAvatarById,
  updateUserById,
  getCurrentUser,
} = require('../controllers/users');

const urlPattern = new RegExp(
  "^((http|https):\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,6})+[a-zA-Z0-9-._~:\\/?#\\[\\]@!$&'()*+,;=]*$"
);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.get('/', getUsers);

router.patch('/me',updateUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(urlPattern),
  }),
}),updateAvatarById);

module.exports = router;
