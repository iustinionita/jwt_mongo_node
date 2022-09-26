const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const { requireAuth, requireLogin } = require('../jwt/requireAuth');

router.post('/signup', userControllers.user_signup);
router.post('/login', userControllers.user_login);
router.post('/logout', requireAuth, userControllers.user_logout);
router.post('/check', requireAuth, userControllers.user_check);
router.post('/update-avatar', requireAuth, userControllers.user_avatar);
router.post('/my-posts', requireLogin, userControllers.user_own_posts);

module.exports = router;