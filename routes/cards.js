const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  deleteCurrentUserCard,
  createCard,
  putLike,
  deleteCurrentUserLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/[0-9a-z]{24}/),
  }),
}), deleteCurrentUserCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({
      scheme: [
        /https?/,
      ],
    }),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/[0-9a-z]{24}/),
  }),
}), putLike);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/[0-9a-z]{24}/),
  }),
}), deleteCurrentUserLike);

module.exports = router;
