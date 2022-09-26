const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/postControllers');
const { requireLogin } = require('../jwt/requireAuth');

router.post('/new-bing',requireLogin, postControllers.post_create);
router.post('/get-posts', requireLogin, postControllers.post_get);
router.post('/check-likes', requireLogin, postControllers.post_like_check);
router.post('/like', requireLogin, postControllers.post_like);
router.post('/dislike', requireLogin, postControllers.post_dislike);

module.exports = router;