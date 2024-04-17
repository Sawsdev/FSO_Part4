const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body
    if (!name || !username || !password) {
        
        response.status(422).json({error: "Missing information, all fields are required"})    
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        name, username, passwordHash
    })
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})



module.exports = usersRouter
