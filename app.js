const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use('/users', router);

app.listen(port, () => {

});
