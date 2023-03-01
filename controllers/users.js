const User = require("../models/users");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((error) => res.status(500).send({ message: `Error creating user ${error}` }))
};

const getUser = (req, res) => {};

const getUsers = (req, res) => {};

module.exports = { createUser, getUser, getUsers };


