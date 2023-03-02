const User = require('../models/users');

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });

        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'Пользователи не найдены' });

        return;
      }
      res.status(200).send(users);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'Not Found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(500).send({ message: err.message });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'Not Found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports = {
  createUser, getUser, getUsers, updateUser, updateAvatar,
};
