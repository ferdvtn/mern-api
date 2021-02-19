const { validationResult } = require("express-validator")

exports.create = (req, res, next) => {
    const { title, image='default.png', body } = req.body
    const errors = validationResult(req)
    if( ! errors.isEmpty()) {
        const err = new Error('Input value tidak valid')
        err.codeSt = 400;
        err.data = errors.array()
        throw err
    }

    res.status(201).json({
        message: "Create blog post success",
        data: {
            post_id: 1,
            title: title,
            image: image,
            body: body,
            created_at: "01/02/2021",
            creator: {
                uid: 1,
                name: "ferd"
            }
        }
    })
    next()
}