const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { statusError, statusSucces } = require('../errorStatus');

const { JWT_SECRET = 'some-word' } = process.env;

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(statusSucces.CREATED).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(statusError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });

          return;
        } if (err.code === 11000) {
          res.status(statusError.CONFLICT).send({ message: 'Пользователь с такими данными уже существует' });

          return;
        }
        res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }));
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => {
      throw new Error();
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        throw new Error();
      }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 3600000 * 24 * 7,
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(statusError.UNAUTHORIZED).send({ message: 'Пользователь не найден' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}` });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(statusError.NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });

        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Передан некорректный id' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(statusError.SERVER_ERROR).send({ message: `Произошла ошибка ${err.status}` }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(statusError.NOT_FOUND).send({ message: 'Пользователь не найден' });

        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(() => res.send({ avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  createUser, getUser, getUsers, updateUser, updateAvatar, loginUser,
};
