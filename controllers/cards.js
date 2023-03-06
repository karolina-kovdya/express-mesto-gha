const Card = require('../models/cards');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user_id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });

        return;
      }
      res.status(500).send({ message: err.message });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'Данные не найдены' });

        return;
      }
      res.status(201).send(cards);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.user._id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });

        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });

        return;
      } if (err.name === 'Not Found') {
        res.status(404).send({ message: 'Карточка не найдена' });

        return;
      }
      res.status(500).send({ message: err.message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });

        return;
      } if (err.name === 'Not Found') {
        res.status(404).send({ message: 'Карточка не найдена' });

        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
