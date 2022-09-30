const express = require('express')
const mongoose = require('mongoose')
const { logger } = require('./middleware/logger')
const authRoute = require('./routes/auth')
const sleepRoutes = require('./routes/sleep')
const connectDB = require('./config/dbConn')
const corsOptions = require('./config/corsOptions')
require('dotenv').config()

const port = process.env.PORT || 4000
const app = express()

// app.use(logger)

connectDB()
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
app.use('/api/user', authRoute)
app.use('/api/sleeps', sleepRoutes)

mongoose.connection.once('open', () => {
  console.log('Databse Connected Successfully!')
  app.listen(port, () => console.log(`Server running on port ${port}`))
})
