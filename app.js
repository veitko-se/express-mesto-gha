require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use(router);
app.use((req, res, next) => {
  res.status(404).send({ message: 'Not found' });
  next();
});
app.use((err, req, res, next) => {
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    const { statusCode = 400, message } = err;
    res.status(statusCode).send({ message: `Переданы некорректные данные: ${message}` });
  } else {
    next();
  }
});
app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `Внутренняя ошибка сервера: ${message}`
      : message,
  });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаю порт ${PORT}`);
});
