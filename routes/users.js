const { celebrate } = require('celebrate');
const router = require('express').Router();
const { updateProfile, getCurrentUser } = require('../controllers/users');
const { userPatch } = require('../utils/validation');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', celebrate(userPatch), updateProfile);

module.exports = router;
