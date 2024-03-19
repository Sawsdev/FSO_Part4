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



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}