const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0)
    return 0

    if(blogs.length === 1)
    return blogs[0].likes

    const totalLikes = blogs.reduce((counter, post) => counter + Number(post.likes), 0 )
    return totalLikes
}



module.exports = {
    dummy,
    totalLikes
}