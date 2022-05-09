const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  deleteCardById,
  createCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteCardById,
);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(
          /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/,
        ),
    }),
  }),
  createCard,
);
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  putLike,
);
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  }),
  deleteLike,
);

module.exports = router;
