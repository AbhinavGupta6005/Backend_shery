const express = require('express')
const authRouters = require('./routes/auth.routes')
const postRouters = require('./routes/post.routes')
const cookieParser = require('cookie-parser')


const app = express()
app.use(cookieParser())
app.use(express.json())


app.use('/api/auth', authRouters)
app.use('/api/posts', postRouters)

module.exports = app;