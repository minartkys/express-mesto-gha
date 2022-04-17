const router = require('express').Router();
const {
  getCards,
  deleteCardById,
  createCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCardById);
router.post('/', createCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
