/* eslint-disable no-shadow */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const AuthorizationError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');
// eslint-disable-next-line consistent-return
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(
        new NotFoundError(
          '_id Ошибка. Пользователь не найден, попробуйте еще раз',
        ),
      );
    })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(
          '_id Ошибка. Пользователь не найден, попробуйте еще раз',
        );
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError(
            `_id Ошибка. ${req.params} Введен некорректный id пользователя`,
          ),
        );
      }
      return next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => User.findById(user._id))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Введите имя, информацию о себе, ссылку на аватар, почту и пароль',
          ),
        );
      }
      if (err.code === 11000) {
        return next(
          new ConflictingRequestError('Такой пользователь уже существует'),
        );
      }
      return next(new Error('Произошла ошибка'));
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля.',
          ),
        );
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const owner = req.user._id;
  User.findByIdAndUpdate(owner, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании пользователя',
        );
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => {
      next(new AuthorizationError('Неправильные почта или пароль.'));
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user._id) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.status(200).send(user);
    })
    .catch(next);
};
