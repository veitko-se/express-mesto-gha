const jwt = require('jsonwebtoken');
const { handlerNotAuthorized } = require('../utils/errors');
const { NODE_ENV, JWT_SECRET } = require('../utils/settings');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handlerNotAuthorized(res);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return handlerNotAuthorized(res);
  }
  req.user = payload;
  return next();
};
