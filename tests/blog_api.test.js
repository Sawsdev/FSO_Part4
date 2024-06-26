const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require ('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)


describe('When there is some blog posts in the db', () => {
  beforeEach(async () => {
      await Blog.deleteMany({})
      const users = await helper.usersInDb()
      for (const blog of helper.initialBlogs) {
          blog.user = users[0].id
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

  describe('Addition of a new blog post', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      const users = await helper.usersInDb()
      
      for (const blog of helper.initialBlogs) {
          blog.user = users[0].id
          let newBlog = new Blog(blog)
          await newBlog.save()
          
      }
  })
    test('should fail returning statuscode 401 if token is missing', async () => {
      const newBlog = {
        title: "Atomic habits",
        author: "James Clear",
        url: "https://jamesclear.com/atomic-habits",
    }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        const allBlogs = await helper.blogsInDb()
        assert.strictEqual(helper.initialBlogs.length, allBlogs.length)
    });
    test('should succeed returning statuscode 201', async () => {
        const newBlog = {
            title: "Atomic habits",
            author: "James Clear",
            url: "https://jamesclear.com/atomic-habits",
        }

        const agent  = await api
                              .post('/api/login')
                              .send({
                                username: 'root',
                                password: "stewiewashere.32"
                              })
        const response = await api
                                 .post('/api/blogs')
                                 .set({Authorization: `Bearer ${agent.body.token}`})
                                 .send(newBlog)
                                 .expect(201)
        const allBlogs = await helper.blogsInDb()
        const createdBlog = response.body
        assert.strictEqual(helper.initialBlogs.length + 1, allBlogs.length)
        assert.strictEqual(newBlog.title, createdBlog.title)
    });
    
    test('should succeed returning statuscode 201 while having 0 likes if likes property is missing', async () => {
      const newBlog = {
        title: "Atomic habits",
        author: "James Clear",
        url: "https://jamesclear.com/atomic-habits",
      }

      const agent  = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: "stewiewashere.32"
      })

      const response = await api
                             .post('/api/blogs')
                             .set({Authorization: `Bearer ${agent.body.token}`})
                             .send(newBlog)
                             .expect(201)
      const createdBlog = response.body
      const allBlogs = await helper.blogsInDb()
      assert.strictEqual(0, createdBlog.likes)
      assert.strictEqual(helper.initialBlogs.length + 1, allBlogs.length)
    });
    
    test('should fail with statuscode 400 if title or url properties are missing',{only: true}, async () => {
      const newBlog = {
        
        author: "James Clear",
        
      }

      const agent  = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: "stewiewashere.32"
      })

    
         await api
        .post('/api/blogs')
        .set({Authorization: `Bearer ${agent.body.token}`})
        .send(newBlog)
        .expect(400)
        const allBlogs = await helper.blogsInDb()
        assert.strictEqual(helper.initialBlogs.length, allBlogs.length)
    
    });
    
  });

  describe('deletion of a blog post', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      const users = await helper.usersInDb()
      for (const blog of helper.initialBlogs) {
          blog.user = users[0].id
          let newBlog = new Blog(blog)
          await newBlog.save()
          
      }
  })

    test('should fail with statuscode 401 if token is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      const dbBlogs = await helper.blogsInDb()
      assert.strictEqual(dbBlogs.length, helper.initialBlogs.length)

    });
    
    test('should succeed with statuscode 204', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const agent  = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: "stewiewashere.32"
      })

      console.log(blogToDelete);


      await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({Authorization: `Bearer ${agent.body.token}`})
      .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    });

    test('should fail with statuscode 400 if a wrong id is given', async () => {
      
      const agent  = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: "stewiewashere.32"
      })


     await api
      .delete(`/api/blogs/abc123`)
      .set({Authorization: `Bearer ${agent.body.token}`})
      .expect(400)
      const dbBlogs = await helper.blogsInDb()
      assert.strictEqual(dbBlogs.length, helper.initialBlogs.length)

    });

  });

  describe('update of a blog post', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
  
      for (const blog of helper.initialBlogs) {
          let newBlog = new Blog(blog)
          await newBlog.save()
          
      }
    })

    test('should successfully update returning updated blog post with statuscode 200', async () => {

        const blogToEdit = {
          title: helper.initialBlogs[3].title,
          author: "Roberto Carlo Martin",
          url: helper.initialBlogs[3].url,
          likes: 14,
        }
        
        const response = await api
          .put(`/api/blogs/${helper.initialBlogs[3]._id}`)
          .send(blogToEdit)
          .expect(200)
         assert.strictEqual(response.body.title, helper.initialBlogs[3].title)
         assert.strictEqual(response.body.author, blogToEdit.author) 
        
        
    });

    test('should fail returning statuscode 400 if title is missing', async () => {
      const blogToEdit = {
        author: "Roberto Carlo Martin",
        url: helper.initialBlogs[3].url,
        likes: 14,
      }
      
      await api
        .put(`/api/blogs/${helper.initialBlogs[3]._id}`)
        .send(blogToEdit)
        .expect(400)
    });

    test('should fail returning statuscode 400 if author is missing', async () => {
      const blogToEdit = {
        title: helper.initialBlogs[3].title,
        url: helper.initialBlogs[3].url,
        likes: 14,
      }
      
      await api
        .put(`/api/blogs/${helper.initialBlogs[3]._id}`)
        .send(blogToEdit)
        .expect(400)
    });



  });

});




after(async () => {
    await mongoose.connection.close()
    console.log("closed");
})