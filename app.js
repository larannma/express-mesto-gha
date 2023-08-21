const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

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
app.use('/users', router);

app.use((req, res, next) => {
  req.user = {
    _id: '64e0c74ac4b6f430193e5ccb',
  };

  next();
});

app.listen(PORT, () => {

});
