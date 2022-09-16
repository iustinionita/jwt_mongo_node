const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const { requireAuth, checkUser } = require('../jwt/requireAuth');

router.post("/signup", userControllers.user_signup);
router.post("/login", userControllers.user_login);
router.get('/logout', requireAuth, userControllers.user_logout);
router.get('/posts', requireAuth, userControllers.user_posts);

module.exports = router;