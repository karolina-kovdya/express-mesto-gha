const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { statusError } = require('./errorStatus');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: '63ff72b99ae9794447ff4fad' };
  next();
});
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => res.status(statusError.NOT_FOUND.send({ message: 'Страница не найдена' })));

mongoose.set('runValidators', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
