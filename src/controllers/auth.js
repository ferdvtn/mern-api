exports.register = (req, res, next) => {
    const { name, email, password } = req.body 
    res.status(201).json({
        message: "Register Success",
        data: {
            id: 1,
            name: name,
            email: email,
            password: password
        }
    })
}