require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes');
const { badRequestErrorHandler, unexpectedErrorHandler } = require('./middlewares/error-handler');
const { HTTP_PORT, DB_URL } = require('./utils/settings');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);
app.use(helmet());
app.disable('x-powered-by');

app.use(router);
app.use(errors()); // ошибки от Celebrate
app.use(badRequestErrorHandler);
app.use(unexpectedErrorHandler);

app.listen(HTTP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаю порт ${HTTP_PORT}`);
});
