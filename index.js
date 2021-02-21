const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const { body } = require('express-validator')
const multer = require('multer')
const path = require('path')

const authRoutes = require('./src/routes/auth')
const blogRoutes = require('./src/routes/blog')

// ---- set multer configuration ----
const setFileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})
const setFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else{
        cb(null, false)
    }
}

app.use(bodyParser.json())
app.use(multer({storage: setFileStorage, fileFilter: setFileFilter}).single('image'))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next();
})
app.use('/image', express.static(path.join(__dirname, 'images')))
app.use('/v1/auth', authRoutes)
app.use(
    '/v1/blog',
    [
        body('title').isLength({min: 5}).withMessage('Input title tidak valid'),
        body('body').isLength({min: 5}).withMessage('Input body tidak valid')
    ],
    blogRoutes
)

app.use((Error, req, res, next) => {
    const { codeSt=500, message, data } = Error 
    res.status(codeSt).json({ message: message, data: data })
})

// waAKHEgfZA16asY7
// { useNewUrlParser: true, useUnifiedTopology: true }
// Connected with mongodb cdn v.2.xx or later
mongoose.connect(
    'mongodb://ferdian:waAKHEgfZA16asY7@cluster-1-shard-00-00.altou.mongodb.net:27017,cluster-1-shard-00-01.altou.mongodb.net:27017,cluster-1-shard-00-02.altou.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-qihies-shard-0&authSource=admin&retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
    console.log('Connection was succesfull')
    app.listen(port)
})
.catch(err => console.log('err : ', err))