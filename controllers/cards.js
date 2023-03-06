const Card = require('../models/cards');
const { statusError, statusSucces } = require('../errorStatus');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(statusSucces.CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Переданы некорректные данные' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(statusError.SERVER_ERROR).send({ message: `Произошла ошибка ${err.status}` }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(statusError.NOT_FOUND).send({ message: 'Карточка не найдена' });

        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Передан некорректный id' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusError.NOT_FOUND).send({ message: 'Карточка не найдена' });

        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Передан некорректный id' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusError.NOT_FOUND).send({ message: 'Карточка не найдена' });

        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(statusError.BAD_REQUEST).send({ message: 'Передан некорректный id' });

        return;
      }
      res.status(statusError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
