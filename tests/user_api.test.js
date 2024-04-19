const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require ('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('When there is some users in database', () => {
    
    describe('Addition of a new user', () => {
        beforeEach(async () => {
            await User.deleteMany({})
    
            const passwordHash = await bcrypt.hash("stewiewashere.32", 10)
            const user = new User({username: 'root', passwordHash})
    
            await user.save()
        })
        test('should succesfully create a new user and return statuscode 201', async () => {
            const currentUsersInDb = await helper.usersInDb()
            const newUser = {
                username: "tester",
                name: "Imthetester",
                password: "ImgonnatestEverything"
            }
    
            const response = await api
                                    .post('/api/users')
                                    .send(newUser)
                                    .expect(201)
                                    .expect('Content-Type',/application\/json/)
            
            const createdUser = response.body
            const allUsers = await helper.usersInDb()
    
            assert.deepStrictEqual(currentUsersInDb.length + 1, allUsers.length)
            assert.deepStrictEqual(newUser.username, createdUser.username)
    
        });
    
        test('should fail if the password is less than 3 characters and return statuscode 400', async () => {
            const currentUsersInDb = await helper.usersInDb()
            const newUser = {
                username: "tester",
                name: "Imthetester",
                password: "Im"
            }
    
            const response = await api
                                    .post('/api/users')
                                    .send(newUser)
                                    .expect(400)
                                    .expect('Content-Type',/application\/json/)
    
            const allUsers = await helper.usersInDb()
    
            assert.deepStrictEqual(currentUsersInDb.length, allUsers.length)
            
        });
    
        test('should fail and return statuscode 422 if username is missing', async () => {
            const currentUsersInDb = await helper.usersInDb()
            const newUser = {
                name: "Imthetester",
                password: "Im"
            }
    
            await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(422)
                    .expect('Content-Type',/application\/json/)
    
            const allUsers = await helper.usersInDb()
    
            assert.deepStrictEqual(currentUsersInDb.length, allUsers.length)
        });

        test('should fail and return statuscode 422 if password is missing', async () => {
            const currentUsersInDb = await helper.usersInDb()
            const newUser = {
                name: "Imthetester",
                username: "tester"
            }
    
            await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(422)
                    .expect('Content-Type',/application\/json/)
    
            const allUsers = await helper.usersInDb()
    
            assert.deepStrictEqual(currentUsersInDb.length, allUsers.length)
        });
    });
    
});


after(async () => {
    await mongoose.connection.close()
    console.log("closed");
})