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
    if (!newBlog.title || !newBlog.url)
    {
      return response.status(400).json({error: "Title and url are required"})
    }
  try {
    if(!newBlog.likes)
    { 
      newBlog.likes = 0
    }

    const createdBlog = await newBlog.save()
    response.status(201).json(createdBlog)
    
  } catch (error) {
    response.status(400).end()
    console.log(error);
  }
  })

  blogsRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
      if (!id || id === "") {
        response.status(400).json({ error: "Missing id"})
      }
    try {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
      
    } catch (error) {
      response.status(400).json({error: error.message})
    }
  })

  blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    if (!id || id === "") {
      response.status(400).json({ error: "Missing id"})
    }
    try {
        const {
          author, 
          title,
          url,
          likes
        } = request.body
        if( !title)
        {
          response.status(400).json({error: "Missing title"})
        }
        if( !author)
        {
          response.status(400).json({error: "Missing title"})
        }
        
        const editedBlog = await Blog.findByIdAndUpdate(id,{
          author, title, url, likes
        }, {new: true})
        response.status(200).json(editedBlog)
    } catch (error) {
      
    }
  })

  module.exports = blogsRouter
  