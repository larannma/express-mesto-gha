const express = require('express');
const mongoose = require('mongoose');
const userModel = require('./models/user');
const user = require('./models/user');
const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('mongodb has been started');
});

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel.create({ name, about, avatar })
  .then(r => {
    return res.send(r);
  })
  .catch(err => {
    if (err.name === "ValidationError") {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({message: 'Invalid data'})
    }
  });
});

app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  return userModel.findById(userId)
  .then(r => {
    if (r === null){
      return res.status(404).send({message: 'User not found'})
    }
    return res.status(200).send(r);
  })
  .catch(err => {
    if (err.name === "CastError") {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({message: 'Invalid Id'})
    }
    return res.status(500).send({message: 'Server error'});
  });
});

app.get('/users', (req, res) => {
  return userModel.find({})
  .then(r => {
    return res.status(200).send(r);
  })
  .catch(err => {
    return res.status(500).send({message: 'Server error'});
  });

})

app.get('/', (req, res) => {
  res.status(201).send('hello world!');
});

app.listen(port, () => {

});
