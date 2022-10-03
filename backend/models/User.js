const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.statics.signup = async function(name, email, password) {
  const isNameEmpty = validator.isEmpty(name, { ignore_whitespace:true })
  const isEmailEmpty = validator.isEmpty(email, { ignore_whitespace:true })
  const isPasswordEmpty = validator.isEmpty(password, { ignore_whitespace:true })
  if (isNameEmpty || isEmailEmpty || isPasswordEmpty) throw Error('All fields must be filled')
  if (!validator.isEmail(email)) throw Error('Email not valid')
  if (!validator.isStrongPassword(password)) throw Error('Password not strong enough')

  const exists = await this.findOne({ email })
  if (exists) throw Error('Email already in use')

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = await this.create({ name: name.trim(), email: email.trim(), password: hash })

  return user
}

userSchema.statics.login = async function(email, password) {
  if (!email || !password) throw Error('All fields must be filled')

  const user = await this.findOne({ email: email.trim() })
  if (!user) throw Error('Incorrect email')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw Error('Incorrect password')

  return user
}

module.exports = mongoose.model('User', userSchema)