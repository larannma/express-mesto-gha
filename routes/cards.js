const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  removeLikeById,
  addLikeById,
} = require('../controllers/cards');

router.delete('/:cardId', deleteCardById);
router.get('/', getCards);
router.post('/', createCard);

router.put('/:cardId/likes', addLikeById);
router.delete('/:cardId/likes', removeLikeById);

module.exports = router;
