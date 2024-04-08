const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require ('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        /*likes: 7,*/
        __v: 0
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        /*likes: 5,*/
        __v: 0
      },
      {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        /*likes: 12,*/
        __v: 0
      },
      {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        /*likes: 10,*/
        __v: 0
      },
      {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        /*likes: 0,*/
        __v: 0
      },
      {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        /*likes: 2,*/
        __v: 0
      }  
]

beforeEach(async () => {
    await Blog.deleteMany({})

    for (const blog of blogs) {
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
        assert.strictEqual(JSON.stringify(Object.keys(blogs[0]).sort()), JSON.stringify(Object.keys(blog).sort()))
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
    const {body:allBlogs} = await api.get('/api/blogs')
    const createdBlog = response.body
    assert.strictEqual(blogs.length + 1, allBlogs.length)
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
  const {body:allBlogs} = await api.get('/api/blogs')
  assert.strictEqual(0, createdBlog.likes)
  assert.strictEqual(blogs.length + 1, allBlogs.length)
});

test('should not add new blog post if title or url properties are missing',{only: true}, async () => {
  const newBlog = {
    
    author: "James Clear",
    
  }

    const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    const {body:allBlogs} = await api.get('/api/blogs')
    assert.strictEqual(blogs.length, allBlogs.length)

});


after(async () => {
    await mongoose.connection.close()
    console.log("closed");
})