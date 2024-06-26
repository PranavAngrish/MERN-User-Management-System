const mongoose = require('mongoose')
const otpSchema = require('./otp')
const passwordSchema = require('./password')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { CustomError } = require('../../middleware/errorHandler')

const options = { host_whitelist: ['gmail.com', 'yahoo.com', 'outlook.com'] }

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
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
  otp: {
    type: otpSchema,
    default: () => ({})
  },
  active: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
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
  
  if (isNameEmpty || isEmailEmpty || isPasswordEmpty) throw new CustomError('All fields must be filled', 400)
  if (!validator.isEmail(email, options)) throw new CustomError('Email not valid', 400)

  const duplicateEmail = await this.findOne({ email }).collation({ locale: 'en', strength: 2 }).lean().exec()
  if (duplicateEmail) throw new CustomError('Email already in use', 409)

  const newUser = { name: name.trim(), email: email.trim(), password: { hashed: password } }

  const user = await this.create(newUser)
  if(!user) throw new CustomError('Invalid user data received', 400)

  return user
}

userSchema.statics.login = async function(email, password) {
  const isEmailEmpty = validator.isEmpty(email, { ignore_whitespace:true })
  const isPasswordEmpty = validator.isEmpty(password, { ignore_whitespace:true })
  if (isEmailEmpty || isPasswordEmpty) throw new CustomError('All fields must be filled', 400)

  const user = await this.findOne({ email: email.trim() }).exec()
  if (!user) throw new CustomError('Incorrect Email', 400)
    
  if(!user.active) throw new CustomError('Your account has been temporarily blocked. Please reach out to our Technical Support team for further assistance.', 403)
  
  const match = await bcrypt.compare(password, user.password.hashed)
  
  if (!match) {
    const now = new Date()
    const day = 24 * 60 * 60 * 1000

    if (user.password.errorCount >= 3 && user.password.errorDate && (now - user.password.errorDate) < day) {
      await this.updateOne({ email }, {$set: { 'active': false }})
      throw new CustomError("You've tried to login too many times with an incorrect account password, this account has been temporarily blocked for security reasons. Please reach out to our Technical Support team for further assistance.", 429)
    }

    if ((now - user.password.errorDate) >= day) {
      await this.updateOne({ email }, {$set: { 'password.errorCount': 0}})
    }
    
    if(!user.active) throw new CustomError('Your account has been temporarily blocked. Please reach out to our Technical Support team for further assistance.', 403)
    
    user.password.errorCount += 1
    user.password.errorDate = new Date()
    await user.save()

    throw new CustomError('Incorrect Password', 400)
  }

  return user
}

module.exports = mongoose.model('User', userSchema)