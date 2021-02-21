const express = require('express')
const router = express.Router()
const blogController = require('../controllers/blog')

router.post('/post', blogController.create)
router.get('/posts', blogController.getAll)
router.get('/post/:postId', blogController.getById)

module.exports = router