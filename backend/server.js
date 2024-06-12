require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const helmet = require("helmet")
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConn')
const session = require('express-session')
const passport = require('passport')
require('./config/passportSetup')

const port = process.env.PORT || 4000
const app = express()

connectDB()
// app.use(logger)
app.use(helmet())
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use(session({ 
  secret: process.env.SESSION_TOKEN_SECRET, 
  resave: false, 
  saveUninitialized: false, 
  cookie: { 
    // secure: true, // HTTPS
    secure: false,
    sameSite: 'Lax',
    httpOnly: true 
  }
}))
app.use(passport.initialize())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/users', require('./routes/user'))
app.use('/api/tasks', require('./routes/task'))
app.use('/api/notes', require('./routes/note'))
app.use('/api/sleeps', require('./routes/sleep'))
// app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Databse Connected Successfully!')
  app.listen(port, () => console.log(`Server running on port ${port}`))
})

