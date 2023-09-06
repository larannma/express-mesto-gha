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
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlPattern),
  }),
}),createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required()
  }),
}),addLikeById);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).required()
  }),
}),removeLikeById);

module.exports = router;
