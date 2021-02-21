const { validationResult } = require("express-validator")
const BlogModel = require('../models/blog')

exports.create = (req, res, next) => {
    const errors = validationResult(req)
    if( ! errors.isEmpty()) {
        const err = new Error('Input value tidak valid')
        err.codeSt = 400;
        err.data = errors.array()
        throw err
    }

    if (! req.file) {
        const err = new Error('Input image tidak valid')
        err.codeSt = 422;
        throw err
    }

    const { title, body } = req.body
    const posting = new BlogModel({
        title: title,
        body: body,
        image: req.file.path,
        author: {uid:'1', name: '_fer'}
    })
    
    posting.save()
    .then(response => {
        res.status(201).json({
            message: "Create blog post success",
            data: response
        })
    })
    .catch(err => console.log('Create blog post error', err))

    // next() // gaboleh make next karena diatas udah return response
}

exports.getAll = (req, res, next) => {
     BlogModel.find()
     .then(result => {
         res.status(200).json({
             message: 'Berhasil mendapatkan data blog post',
             data: result
         })
     })
     .catch(error => next(err))
}

exports.getById = (req, res, next) => {
    console.log('req.params : ', req.params);
    BlogModel.findById(req.params.postId)
    .then(result => {
        if (! result) {
            const error = new Error('Data id tidak ditemukan')
            error.codeSt = 404
            error.data = result
            throw error
        }

        res.status(200).json({
            message: 'Data id berhasil ditemukan',
            data: result
        })
    })
    .catch(err => next(err))
}