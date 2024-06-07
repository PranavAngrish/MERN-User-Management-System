const mongoose = require('mongoose')
const otpSchema = require('./otp')
const passwordSchema = require('./password')
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
  roles: {
    type: [String],
    default: ["User"]
  },
  password: passwordSchema,
  otp: otpSchema,
  active: {
    type: Boolean,
    default: true
  },
  tasks:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Task'
  }
}, { timestamps: true })

userSchema.statics.signup = async function(name, email, password) {
  const isNameEmpty = validator.isEmpty(name ?? '', { ignore_whitespace:true })
  const isEmailEmpty = validator.isEmpty(email ?? '', { ignore_whitespace:true })
  const isPasswordEmpty = validator.isEmpty(password ?? '', { ignore_whitespace:true })
  if (isNameEmpty || isEmailEmpty || isPasswordEmpty) throw Error('All fields must be filled')
  if (!validator.isEmail(email)) throw Error('Email not valid')

  const exists = await this.findOne({ email }).lean().exec()
  if (exists) throw Error('Email already in use')

  const newUser = {name: name.trim(), email: email.trim(), password: { hashed: password }}

  const user = await this.create(newUser)
  if(!user) throw Error('Invalid user data received')

  return user
}

userSchema.statics.login = async function(email, password) {
  const isEmailEmpty = validator.isEmpty(email, { ignore_whitespace:true })
  const isPasswordEmpty = validator.isEmpty(password, { ignore_whitespace:true })
  if (isEmailEmpty || isPasswordEmpty) throw Error('All fields must be filled')

  const user = await this.findOne({ email: email.trim() }).exec()
  if (!user) throw Error('Incorrect Email')
    
  if(!user.active) throw Error('Your account has been temporarily blocked. Please reach out to our Technical Support team for further assistance.')
  
  const match = await bcrypt.compare(password, user.password.hashed)
  
  if (!match) {
    const now = new Date()
    const day = 24 * 60 * 60 * 1000

    if (user.password.errorCount >= 3 && user.password.errorDate && (now - user.password.errorDate) < day) {
      await this.updateOne({ email }, {$set: { 'active': false }})
      throw Error("You've tried to login too many times with an incorrect account password, this account has been temporarily blocked for security reasons. Please reach out to our Technical Support team for further assistance.")
    }

    if ((now - user.password.errorDate) >= day) {
      await this.updateOne({ email }, {$set: { 'password.errorCount': 0}})
    }
    
    if(!user.active) throw Error('Your account has been temporarily blocked. Please reach out to our Technical Support team for further assistance.')
    
    user.password.errorCount += 1
    user.password.errorDate = new Date()
    await user.save()

    throw Error('Incorrect Password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)