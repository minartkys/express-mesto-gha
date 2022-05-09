const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/:userId', auth, getUserById);
router.patch('/users/me', auth, updateUser);
router.patch('/users/me/avatar', auth, updateAvatar);
router.get('/users/me', auth, getUserMe);
module.exports = router;
