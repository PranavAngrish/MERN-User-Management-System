const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
require('dotenv').config()

const port = process.env.PORT || 3000
const url = process.env.DATABASE_URL
const app = express()

app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
app.use('/api/user', authRoute)

mongoose.connect(url)
  .then(() => {
    console.log("Databse Connected Successfully!")
    app.listen(port, () => console.log(`Server listening at port: ${port}`))
  })
  .catch((error) => {
    console.log(error)
    process.exit()
})
