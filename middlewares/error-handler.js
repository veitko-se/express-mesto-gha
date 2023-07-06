const BadRequestError = require('../errors/bad-request-err');

module.exports.badRequestErrorHandler = (err, req, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    next(new BadRequestError(`Переданы некорректные данные: ${err.message}`));
  } else {
    next(err);
  }
};

// eslint-disable-next-line no-unused-vars
module.exports.unexpectedErrorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `Внутренняя ошибка сервера: ${message}`
      : message,
  });
};
