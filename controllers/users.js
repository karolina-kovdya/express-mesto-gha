const User = require('../models/users');
const { statusError, statusSucces } = require('../errorStatus');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(statusSucces.CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(statusError.NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });

        return;
      }
      res.status(statusSucces.OK).send(user);
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
    .then((users) => res.status(statusSucces.OK).send(users))
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
      res.status(statusSucces.OK).send(user);
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
    .then(() => res.status(statusSucces.OK).send({ avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  createUser, getUser, getUsers, updateUser, updateAvatar,
};
