const express = require('express');
const mongoose = require('mongoose');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

const {
  createUser,
  login
} = require('./controllers/users');

const {
  PORT = 3000,
  DB_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64e47928c9db88faf1af3717',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  return res.status(404).send({ message: 'Page does not exist' });
})

app.listen(PORT, () => {

});
