const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const { NODE_ENV, JWT_SECRET } = require('../utils/settings');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError(`Пользователь по указанному _id='${userId}' не найден`))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(`Пользователь с указанным email='${email}' уже существует`);
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true })
    .orFail(() => new NotFoundError(`Пользователь по указанному _id='${userId}' не найден`))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true })
    .orFail(() => new NotFoundError(`Пользователь по указанному _id='${userId}' не найден`))
    .then((avatar) => res.send(avatar))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .orFail(() => new UnauthorizedError('Отказано в доступе'))
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError(`Пользователь по указанному _id='${userId}' не найден`))
    .then((user) => res.send(user))
    .catch(next);
};
