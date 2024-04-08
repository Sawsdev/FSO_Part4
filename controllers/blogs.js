const Blog = require('../models/blog')
const blogsRouter = require('express').Router()


blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
    
  } catch (error) {
    response.status(400).end()
    console.log(error);
  }
  })
  
  blogsRouter.post('/', async (request, response) => {
    const newBlog = new Blog(request.body)
  try {
    const createdBlog = await newBlog.save()
    response.status(201).json(createdBlog)
    
  } catch (error) {
    response.status(400).end()
    console.log(error);
  }
  })

  module.exports = blogsRouter
  