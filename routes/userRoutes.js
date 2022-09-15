const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const requireAuth = require('../jwt/requireAuth');

router.post("/signup", userControllers.user_signup);
router.post("/login", userControllers.user_login);
router.get('/posts',requireAuth, userControllers.user_posts);

module.exports = router;