const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/postControllers');
const { requireAuth } = require('../jwt/requireAuth');

router.post('/new-post', postControllers.post_create);
router.post('/get-posts', postControllers.post_get);

module.exports = router;