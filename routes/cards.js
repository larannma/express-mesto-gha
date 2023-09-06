const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCardById,
  removeLikeById,
  addLikeById,
} = require('../controllers/cards');

const urlPattern = new RegExp(
  "^((http|https):\\/\\/)?(www\\.)?[a-zA-Z0-9-]+(\\.[a-zA-Z]{2,6})+[a-zA-Z0-9-._~:\\/?#\\[\\]@!$&'()*+,;=]*$"
);

router.delete('/:cardId', deleteCardById);
router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().regex(urlPattern),
  }),
}),createCard);

router.put('/:cardId/likes', addLikeById);
router.delete('/:cardId/likes', removeLikeById);

module.exports = router;
