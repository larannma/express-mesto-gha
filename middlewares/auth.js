const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretstring';
const { NotAuthorizedError } = require('../errors/errors');

const auth = (req, res, next) => {
  const { token = null } = req.cookies
  if (!token) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
}

module.exports = {
  auth
}
