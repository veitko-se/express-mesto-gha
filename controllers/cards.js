const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCardById = (cardId) => Card.findById(cardId)
  .orFail(() => new NotFoundError(`Карточка с _id='${cardId}' не найдена`));

const checkCardOwner = (userId, card) => {
  if (userId !== card.owner._id.toString()) {
    return Promise.reject(new ForbiddenError('Отказано в доступе'));
  }
  return card;
};

const deleteCard = (cardId) => Card.findByIdAndRemove(cardId)
  .orFail(() => new NotFoundError(`Карточка с _id='${cardId}' не найдена`));

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCurrentUserCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  getCardById(cardId)
    .then((card) => checkCardOwner(userId, card))
    .then((checkedCard) => deleteCard(checkedCard))
    .then((deletedCard) => res.send(deletedCard))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

module.exports.putLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findOneAndUpdate(
    { _id: cardId },
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError(`Карточка с _id='${cardId}' не найдена`))
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findOneAndUpdate(
    { _id: cardId },
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError(`Карточка с _id='${cardId}' не найдена`))
    .then((updatedCard) => res.send(updatedCard))
    .catch(next);
};
