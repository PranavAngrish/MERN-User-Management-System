const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const connectDB = require('./config/dbConn')
const corsOptions = require('./config/corsOptions')
require('dotenv').config()

const port = process.env.PORT || 4000
const app = express()

connectDB()

app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
app.use('/api/user', authRoute)

mongoose.connection.once('open', () => {
  console.log('Databse Connected Successfully!')
  app.listen(port, () => console.log(`Server running on port ${port}`))
}).catch((error) => {console.log(error)})
