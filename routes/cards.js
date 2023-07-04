const router = require('express').Router();
const {
  getCards,
  deleteCurrentUserCard,
  createCard,
  putLike,
  deleteCurrentUserLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCurrentUserCard);
router.post('/', createCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteCurrentUserLike);

module.exports = router;
