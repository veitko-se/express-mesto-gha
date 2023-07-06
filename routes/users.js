const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().pattern(/[0-9a-z]{24}/),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/[a-zA-Z0-9а-яА-Я\-._~:/?#[@!$&'()*+,;=]+/),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  params: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/[a-zA-Z0-9а-яА-Я\-._~:/?#[@!$&'()*+,;=]+/),
  }),
}), updateAvatar);

module.exports = router;
