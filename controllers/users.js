const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;
const userModel = require('../models/user');

const getUsers = (req, res) => userModel.find({})
  .then((r) => res.status(200).send(r))
  .catch(() => res.status(500).send({ message: 'Server error' }));

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
    .then((r) => res.send(r))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  return userModel.findById(userId)
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'User not found' });
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

const updateUserById = (req, res) => {
  res.status(200).send({ mesaage: 'Not implemented' });
};

const deleteUserById = (req, res) => {
  res.status(200).send({ mesaage: 'Not implemented' });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
