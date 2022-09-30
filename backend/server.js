const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const connectDB = require('./config/dbConn')
require('dotenv').config()

const port = process.env.PORT || 5000
const app = express()

connectDB()
// app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
app.use('/api/user', require('./routes/auth'))
app.use('/api/sleeps', require('./routes/sleep'))
// app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Databse Connected Successfully!')
  app.listen(port, () => console.log(`Server running on port ${port}`))
})

