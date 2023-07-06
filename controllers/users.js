const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
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
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => {
      const responseUser = user.toObject();
      delete responseUser.password;
      res.status(201).send(responseUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(`Пользователь с указанным email='${req.body.email}' уже существует`));
      } else {
        next(err);
      }
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
