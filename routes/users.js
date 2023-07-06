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
router.patch('/me', updateUser);
router.patch('/me/avatar', celebrate({
  params: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/[a-zA-Z0-9а-яА-Я\-._~:/?#[@!$&'()*+,;=]+/),
  }),
}), updateAvatar);

module.exports = router;
