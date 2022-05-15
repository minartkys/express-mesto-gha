const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const error = require('./middlewares/error');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const AVATAR_REGEX = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;
const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(requestLogger);
const allowedCors = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://domainname.students.nomoredomains.xyz',
  'https://domainname.minartkys.nomoredomains.xyz/',
  'https://domainname.minartkys.nomoredomains.xyz',
];
app.use(
  cors({
    origin: allowedCors,
  }),
);
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom((value, helpers) => {
        if (AVATAR_REGEX.test(value)) {
          return value;
        }
        return helpers.message('Некорректная ссылка');
      }),
    }),
  }),
  createUser,
);
app.use(auth);
app.use('/', require('./routes/users'));

app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError('404 Not Found')));
app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
