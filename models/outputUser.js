function outputUser(user) {
    if (user) {
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
    } else {
        console.log("OutputUser: No User");
    }
}

module.exports = outputUser;