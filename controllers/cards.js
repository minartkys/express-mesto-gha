const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка не обнаружена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при удалении карточки',
        });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// eslint-disable-next-line consistent-return
module.exports.putLike = (req, res) => {
  if (req.params.cardId.length !== 24) {
    return res.status(400).send({
      message: 'Передан некорректный ID карточки',
    });
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка не обнаружена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Передан некорректный ID карточки',
        });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({
          message: 'Карточка не обнаружена',
        });
      }
      return res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};

// eslint-disable-next-line consistent-return
module.exports.deleteLike = (req, res) => {
  if (req.params.cardId.length !== 24) {
    return res.status(400).send({
      message: 'Передан некорректный ID карточки',
    });
  }
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({
          message: 'Карточка не обнаружена',
        });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Передан некорректный ID карточки',
        });
      }
      if (err.name === 'CastError') {
        return res.status(404).send({
          message: 'Карточка не обнаружена',
        });
      }
      return res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};
