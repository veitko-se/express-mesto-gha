const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;
const NOT_AUTHORIZED = 401;

const handlerServerError = (res, err) => {
  res.status(SERVER_ERROR).send({ message: `Внутренняя ошибка сервера: ${err.message}` });
};
const handlerCardNotFoundError = (res, id) => {
  res.status(NOT_FOUND).send({ message: `Карточка с _id='${id}' не найдена` });
};
const handlerUserNotFoundError = (res, id) => {
  res.status(NOT_FOUND).send({ message: `Пользователь по указанному _id='${id}' не найден` });
};
const handlerBadRequestError = (res, err) => {
  res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные: ${err.message}` });
};
const handlerNotAuthorized = (res) => {
  res.status(NOT_AUTHORIZED).send({ message: 'Отказано в доступе' });
};

module.exports = {
  handlerBadRequestError,
  handlerUserNotFoundError,
  handlerCardNotFoundError,
  handlerServerError,
  handlerNotAuthorized,
};
