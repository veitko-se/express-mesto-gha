const Card = require('../models/card');
const { handlerBadRequestError, handlerCardNotFoundError, handlerServerError } = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handlerServerError(res, err));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => new Error('NOT_FOUND'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerCardNotFoundError(res, cardId);
      } else if (err.name === 'CastError') {
        handlerBadRequestError(res);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        handlerBadRequestError(res);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.putLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findOneAndUpdate(
    { _id: cardId },
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NOT_FOUND'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerCardNotFoundError(res, cardId);
      } else if (err.name === 'CastError') {
        handlerBadRequestError(res);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findOneAndUpdate(
    { _id: cardId },
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NOT_FOUND'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerCardNotFoundError(res, cardId);
      } else if (err.name === 'CastError') {
        handlerBadRequestError(res);
      } else {
        handlerServerError(res, err);
      }
    });
};
