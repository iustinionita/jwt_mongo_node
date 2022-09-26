function outputUser(user) {
    const outputUser = {
        username: user.username,
        avatar: user.avatar,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        posts: user.posts,
        id: user._id
    }
    return outputUser
}

module.exports = outputUser;