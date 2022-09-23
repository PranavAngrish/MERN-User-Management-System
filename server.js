const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const port = process.env.PORT || 3000
const url = process.env.DATABASE_URL
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json())

mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => {
    console.log("Databse Connected Successfully!")
    app.listen(port, () => console.log(`Server listening at port http://localhost:${port}`))
  })
  .catch((error) => {
    console.log(`Couldn't connect to the database: ${error}`)
    process.exit()
})

app.get('/', (req, res) => res.render('home'))
app.get('/blablabla', (req, res) => res.render('blablabla'))

