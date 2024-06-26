const Blog = require('../models/blog')
const User = require('../models/user')
const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
    

  })
  
  blogsRouter.post('/', userExtractor, async (request, response) => {
    
    const {userId} = request  
    const newBlog = new Blog(request.body)
    if (!newBlog.title || !newBlog.url)
    {
      return response.status(400).json({error: "Title and url are required"})
    }
    // if ( !newBlog.user ) {
    //   return response.status(422).json({error: "User is required"})
    // }

    if(!newBlog.likes)
    { 
      newBlog.likes = 0
    }
    const user = await User.findById(userId)
    newBlog.user = user.id
    const createdBlog = await newBlog.save()
    user.blogs = user.blogs.concat(createdBlog._id)
    user.save()
    response.status(201).json(createdBlog)

  })

  blogsRouter.delete('/:id', userExtractor, async (request, response) => {

    const {userId} = request
    const id = request.params.id
    if (!id || id === "") {
      response.status(400).json({ error: "Missing id"})
    }
    
    const blog = await Blog.findById(id)

    if (blog.user.toString() !== userId.toString()) {
      return response.status(401).json({error: "Invalid token"})
    }


    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
      

  })

  blogsRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    if (!id || id === "") {
      response.status(400).json({ error: "Missing id"})
    }

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

  })

  module.exports = blogsRouter
  