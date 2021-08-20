const router = require('express').Router();
const { celebrate } = require('celebrate');
const usersRouter = require('./users');
const movieRouter = require('./movies');
const {
  createUser, login,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signin, signup } = require('../utils/validation');

router.post('/signin', celebrate(signin), login);
router.post('/signup', celebrate(signup), createUser);
router.use(auth);
router.use('/', usersRouter);
router.use('/', movieRouter);

module.exports = router;
