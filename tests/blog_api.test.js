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

test('every blog post in the list must have the correct keys', {only: true}, async () => {
    const response = await api.get('/api/blogs')
    const blogKeys = {
        id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/"
    } 
    response.body.map((blog) => {
        assert.strictEqual(JSON.stringify(Object.keys(blogKeys).sort()), JSON.stringify(Object.keys(blog).sort()))
    })
});


after(async () => {
    await mongoose.connection.close()
    console.log("closed");
})