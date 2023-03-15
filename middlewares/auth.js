const jwt = require('jsonwebtoken');
const { statusError } = require('../errorStatus');

const { JWT_SECRET = 'some-word' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization.startsWith('Bearer ')) {
    res.status(statusError.UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });

    return;
  }

  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(statusError.UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });

    return;
  }

  req.user = payload;

  next();
};

module.exports = auth;
