const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1 })
    return response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { name, username, password } = request.body
    if ( !username || !password) {
        
       return response.status(422).json({error: "Missing information, all fields are required"}).end()    
    }

    if (password.length < 3) {
        return response.status(400).json({error: "Password lenght must be at leas 3 characters long."})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        name, username, passwordHash
    })
    const savedUser = await newUser.save()
    return response.status(201).json(savedUser)
})



module.exports = usersRouter
