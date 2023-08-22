const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;
const cardModel = require('../models/card');

const getCards = (req, res) => cardModel.find({})
  .then((r) => res.status(200).send(r))
  .catch(() => res.status(500).send({ message: 'Server error' }));

const createCard = (req, res) => {
  const { name, link, owner = '64e3a54eed994c6abf058678' } = req.body;
  return cardModel.create({ name, link, owner })
    .then((r) => res.send(r))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findOneAndDelete(cardId)
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(r);
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid Id' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const addLikeById = (req, res) => {
  const { cardId } = req.params;
  return cardModel.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(r);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Id' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const removeLikeById = (req, res) => {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(r);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Id' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLikeById,
  removeLikeById,
};
