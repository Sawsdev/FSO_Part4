const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0)
    return 0


    const totalLikes = blogs.reduce((counter, post) => counter + Number(post.likes), 0 )
    return totalLikes
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0)
    return false
   
    const maxblogsLikes = Math.max(...blogs.map((post) => post.likes) )
    const maxLikesBlog = blogs.find((post) => post.likes === maxblogsLikes)
    const favoriteBlog = {
        title: maxLikesBlog.title,
        author: maxLikesBlog.author,
        likes: maxLikesBlog.likes
    }
    return favoriteBlog
}

const mostBlogs = (blogs) => {
    if( blogs.length === 0)
    return false

    const blogEntries = _.countBy(blogs, 'author')
    const maxBlogEntries = Math.max(...Object.values(blogEntries))
    const keys = Object.keys(blogEntries)
    const values = Object.values(blogEntries)
    const index = values.findIndex((n) => n === maxBlogEntries)

    return {
        author: keys[index],
        blogs: maxBlogEntries
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return false
    }
    const authors = _.groupBy(blogs, 'author')
    const authorsLikes = _.map(authors, (blogs, author) => ({
        author,
        likes: _.sumBy(blogs, 'likes')
    } ))
    const mostAuthorLikes = Math.max(...authorsLikes.map(author => author.likes))
    const mostLikes = _.find(authorsLikes, {likes: mostAuthorLikes})
    return mostLikes
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}