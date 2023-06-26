const User = require('../models/user');
const { handlerBadRequestError, handlerUserNotFoundError, handlerServerError } = require('../utils/errors');

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
        handlerBadRequestError(res);
      } else {
        handlerServerError(res, err);
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        handlerBadRequestError(res);
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
        handlerBadRequestError(res);
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
        handlerBadRequestError(res);
      } else {
        handlerServerError(res, err);
      }
    });
};
