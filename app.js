const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден!' });
});
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
