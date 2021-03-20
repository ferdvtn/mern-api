const { validationResult } = require("express-validator")
const BlogModel = require('../models/blog')
const path = require('path')
const fs = require('fs')

exports.create = (req, res, next) => {
    const errors = validationResult(req)
    if( ! errors.isEmpty()) {
        const err = new Error('Input value tidak valid')
        err.codeSt = 400
        err.data = errors.array()
        throw err
    }

    if (! req.file) {
        const err = new Error('Input image tidak valid')
        err.codeSt = 422
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
    const page = parseInt(req.query.page) || 1
    const perpage = parseInt(req.query.perpage) || 5
    let totalPost

    BlogModel.find().countDocuments()
    .then(count => {
        totalPost = count;
        return BlogModel.find().skip((page - 1) * perpage).limit(perpage)
    })
    .then(rows => {
        return res.status(200).json({
            message: 'Berhasil mendapatkan data blog post',
            page: page,
            perpage: perpage,
            total: totalPost,
            data: rows

        })
    })
    .catch(err => next(err))
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

exports.update = (req, res, next) => {
    // validasi input
    const error = validationResult(req)
    if (! error.isEmpty()) {
        const err = new Error('Input value tidak valid')
        err.codeSt = 400
        err.data = error.array()
        throw err
    }
    
    // validasi image
    if (! req.file) {
        const err = new Error('Input image tidak valid')
        err.codeSt = 422
        throw err
    }

    // proses update
    BlogModel.findById(req.params.postId)
    .then(result => {
        if (! result) {
            const err = new Error
            err.codeSt = 404
            err.data = result
            throw err
        }

        result.title = req.body.title
        result.body = req.body.body
        result.image = req.file.path

        result.save()
        .then(data => {
            console.log('data : ', data);
            res.status(200).json(({
                message: 'Update blog post ',
                data: data
            }))
        })
    })
    .catch(err => next(err))
}

exports.delete = (req, res, next) => {
    const postId = req.params.postId

    BlogModel.findById(postId)
    .then(postRow => {
        if (! postRow) {
            const err = new Error('Data id tidak ditemukan')
            err.codeSt = 400
            err.data = postRow
            throw err
        }

        deletePostImage(path.join(__dirname, '../..', postRow.image))
        return BlogModel.findByIdAndRemove(postId)
    })
    .then(result => {
        res.status(200).json({
            message: 'Berhasil hapus data blog post',
            data: result
        })
    })
    .catch(err => next(err))
}

const deletePostImage = path => {
    fs.unlink(path, err => console.log(err))
}