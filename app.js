const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '625be62a0d5195b8d193a0d6',
  };

  next();
});
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(('/*'), (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден!' });
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
