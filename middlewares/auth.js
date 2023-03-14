const jwt = require('jsonwebtoken');
const { statusError } = require('../errorStatus');

const { JWT_SECRET = 'some-word' } = process.env;

const autorize = (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization || autorization.sartsWith('Bearer')) {
    res.status(statusError.UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
  }

  let payload;
  const token = autorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(statusError.UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
  }

  req.user = payload;

  next();
};

module.exports = autorize;
