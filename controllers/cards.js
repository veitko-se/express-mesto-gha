const Card = require('../models/card');
const {
  handlerBadRequestError,
  handlerCardNotFoundError,
  handlerServerError,
  handlerNotAuthorized,
} = require('../utils/errors');

const getCardById = (cardId) => Card.findById(cardId)
  .orFail(() => new Error('NOT_FOUND'));

const checkCardOwner = (userId, card) => {
  if (userId !== card.owner._id.toString()) {
    return Promise.reject(new Error('NOT_AUTHORIZED'));
  }
  return card;
};

const deleteCard = (cardId) => Card.findByIdAndRemove(cardId)
  .orFail(() => new Error('NOT_FOUND'));

const deleteLike = (userId, cardId) => Card.findOneAndUpdate(
  { _id: cardId },
  { $pull: { likes: userId } },
  { new: true, runValidators: true },
)
  .orFail(() => new Error('NOT_FOUND'));

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handlerServerError(res, err));
};

module.exports.deleteCurrentUserCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  getCardById(cardId)
    .then((card) => checkCardOwner(userId, card))
    .then((checkedCard) => deleteCard(checkedCard))
    .then((deletedCard) => res.send(deletedCard))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerCardNotFoundError(res, cardId);
      } else if (err.message === 'NOT_AUTHORIZED') {
        handlerNotAuthorized(res);
      } else if (err.name === 'CastError') {
        handlerBadRequestError(res, err);
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
        handlerBadRequestError(res, err);
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
        handlerBadRequestError(res, err);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.deleteCurrentUserLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  getCardById(cardId)
    .then((card) => checkCardOwner(userId, card))
    .then((checkedCard) => deleteLike(userId, checkedCard))
    .then((updatedCard) => res.send(updatedCard))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerCardNotFoundError(res, cardId);
      } else if (err.message === 'NOT_AUTHORIZED') {
        handlerNotAuthorized(res);
      } else if (err.name === 'CastError') {
        handlerBadRequestError(res, err);
      } else {
        handlerServerError(res, err);
      }
    });
};
