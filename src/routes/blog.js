const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const blogController = require('../controllers/blog')

router.post('/post', [
    body('title').isLength({min: 5}).withMessage('Input title tidak valid'),
    body('body').isLength({min: 5}).withMessage('Input body tidak valid')
], blogController.create)
router.get('/posts', blogController.getAll)
router.get('/post/:postId', blogController.getById)
router.put('/post/:postId', [
    body('title').isLength({min: 5}).withMessage('Input title tidak valid'),
    body('body').isLength({min: 5}).withMessage('Input body tidak valid')
], blogController.update)
router.delete('/post/:postId', blogController.delete)

module.exports = router