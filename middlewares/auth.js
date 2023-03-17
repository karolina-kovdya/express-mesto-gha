const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized_error');

const { JWT_SECRET = 'some-word' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }

  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Пользователь не авторизован'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
