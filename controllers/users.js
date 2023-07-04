const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  handlerBadRequestError,
  handlerUserNotFoundError,
  handlerServerError,
  handlerNotAuthorized,
} = require('../utils/errors');
const { NODE_ENV, JWT_SECRET } = require('../utils/settings');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handlerServerError(res, err));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error('NOT_FOUND'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerUserNotFoundError(res, userId);
      } else if (err.name === 'CastError') {
        handlerBadRequestError(res, err);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.createUser = (req, res) => {
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
      if (err.name === 'ValidationError') {
        handlerBadRequestError(res, err);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true })
    .orFail(() => new Error('NOT_FOUND'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerUserNotFoundError(res, userId);
      } else if (err.name === 'ValidationError') {
        handlerBadRequestError(res, err);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true })
    .orFail(() => new Error('NOT_FOUND'))
    .then((avatar) => res.send(avatar))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerUserNotFoundError(res, userId);
      } else if (err.name === 'ValidationError') {
        handlerBadRequestError(res, err);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.login = (req, res) => {
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
    .catch(() => {
      handlerNotAuthorized(res);
    });
};

module.exports.getUserMe = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new Error('NOT_FOUND'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        handlerUserNotFoundError(res, userId);
      } else if (err.name === 'CastError') {
        handlerBadRequestError(res, err);
      } else {
        handlerServerError(res, err);
      }
    });
};
