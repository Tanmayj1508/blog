require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const Blog = require('./model/blog')
const { checkForAuthenticationCookie } = require('./middleware/authentication')


const app = express()
const PORT = process.env.PORT
// export MONGO_URL=mongodb://127.0.0.1:27017/blogify
console.log(process.env.PORT)
mongoose.connect(process.env.MONGO_URL).then((msg) => {
    console.log('mongodb connected')
})

app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.set('views', path.resolve("./views"))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {user: req.user,
        blogs: allBlogs
    })
})
app.use('/user', userRouter)
app.use('/blog', blogRouter)
app.listen(PORT, () => { console.log(`server started at port ${PORT}`) })



// show dbs
// show collections
// db.users.find({})
// db.users.insert({})