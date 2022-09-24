const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const { requireAuth, checkUser } = require('./middleware/auth')
require('dotenv').config()

const port = process.env.PORT || 3000
const url = process.env.DATABASE_URL
const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

mongoose.connect(url, { useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => {
    console.log("Databse Connected Successfully!")
    app.listen(port, () => console.log(`Server listening at port http://localhost:${port}`))
  })
  .catch((error) => {
    console.log(error)
    process.exit()
})

app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'))
app.get('/blablabla', requireAuth, (req, res) => res.render('blablabla'))
app.use(authRoute)
