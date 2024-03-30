const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require ('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('should list every blog post in database in JSON format', async () => {
   await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type',/application\/json/)
});


after(async () => {
    await mongoose.connection.close()
})