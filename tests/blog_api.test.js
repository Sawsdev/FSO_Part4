const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require ('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)



beforeEach(async () => {
    await Blog.deleteMany({})

    for (const blog of helper.initialBlogs) {
        let newBlog = new Blog(blog)
        await newBlog.save()
        
    }
})

test('should list every blog post in database in JSON format', async () => {
   await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type',/application\/json/)
});

test('every blog post in the list must have the correct keys', async () => {
    const response = await api.get('/api/blogs')
    response.body.map((blog) => {
        assert.strictEqual(JSON.stringify(Object.keys(helper.blogCorrectKeys).sort()), JSON.stringify(Object.keys(blog).sort()))
    })
});

test('should add new blog post correctly', async () => {
    const newBlog = {
        title: "Atomic habits",
        author: "James Clear",
        url: "https://jamesclear.com/atomic-habits",
    }
    const response = await api
                             .post('/api/blogs')
                             .send(newBlog)
                             .expect(201)
    const allBlogs = await helper.blogsInDb()
    const createdBlog = response.body
    assert.strictEqual(helper.initialBlogs.length + 1, allBlogs.length)
    assert.strictEqual(newBlog.title, createdBlog.title)
});

test('should add new blog post correctly having 0 likes if likes property is missing', async () => {
  const newBlog = {
    title: "Atomic habits",
    author: "James Clear",
    url: "https://jamesclear.com/atomic-habits",
  }
  const response = await api
                         .post('/api/blogs')
                         .send(newBlog)
                         .expect(201)
  const createdBlog = response.body
  const allBlogs = await helper.blogsInDb()
  assert.strictEqual(0, createdBlog.likes)
  assert.strictEqual(helper.initialBlogs.length + 1, allBlogs.length)
});

test('should not add new blog post if title or url properties are missing',{only: true}, async () => {
  const newBlog = {
    
    author: "James Clear",
    
  }

     await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    const allBlogs = await helper.blogsInDb()
    assert.strictEqual(helper.initialBlogs.length, allBlogs.length)

});


after(async () => {
    await mongoose.connection.close()
    console.log("closed");
})