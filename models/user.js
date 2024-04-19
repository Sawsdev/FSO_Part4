const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'The username is required'],
        unique: [true, 'usernames must be unique'],
        min: [3, 'The username must have at least 3 characters long']
    },
    passwordHash: {
        type: String,
        required: [true, 'The password is required']
    },
    name: String,
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User