const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Поле "email" заполнено не корректно',
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    unique: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => this.validator.isUrl(url),
      message: 'Поле заполнено не корректно',
    },
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
