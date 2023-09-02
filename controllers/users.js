const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;
const userModel = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = 'supersecretstring';

const getUsers = (req, res) => userModel.find({})
  .then((r) => res.status(200).send(r))
  .catch(() => res.status(500).send({ message: 'Server error' }));

const createUser = (req, res) => {
  const { name, about, avatar, email, password} = req.body;
  if (!validator.isEmail(email)) {
    return res
      .status(403)
      .send({message: "Email введен неверно"})
  }

  if (!validator.isLength(password, { min: 8 })) {
    return res
      .status(403)
      .send({message: "Пароль должен содержать не менее 8 символов"})
  }

  bcrypt.hash(password, SALT_ROUNDS, function(err, hash) {
    return userModel.findOne( { email } ).then((user) => {
      if (user) {
        return res
          .status(403)
          .send({message: "Пользователь с таким email уже существует"})
      }
      return userModel.create({ name, about, avatar, email, password: hash })
      .then((r) => res.status(201).send({message: `Пользователь ${email} зарегестрирован`}))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid data' });
        }
        return res.status(500).send({ message: 'Server error' });
      });
    })
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
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { 'name': name, 'about': about }, { new: true, runValidators: true })
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(req.body);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Id' });
      } else if (err.name === 'ValidationError'){
        return res.status(400).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const updateAvatarById = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(userId, { 'avatar': avatar }, {new: true, runValidators: true})
    .then((r) => {
      if (r === null) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(req.body);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Id' });
      } else if (err.name === 'ValidationError'){
        return res.status(400).send({ message: 'Invalid data' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(403)
      .send({message: "Email или пароль не могут быть пустыми"})
  }
  return userModel.findOne({ email }).then((user) => {
    if (!user) {
      return res
      .status(403)
      .send({message: "Такого пользователя не существует"})
    }
    bcrypt.compare(password, user.password, function(err, isValid) {
      if (!isValid) {
        return res
        .status(401)
        .send({message: "Пароль неверный!"})
      }

      const token = jwt.sign({
        _id: user._id
      }, JWT_SECRET, { expiresIn: '1w' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true
      });

      return res.status(200).send({ token })
    });
  }).catch((err) => {
    res.status(500).send({ message: 'Произошла ошибка'})
  })
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  updateAvatarById,
  login
};
