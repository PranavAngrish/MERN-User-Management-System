const User = require('../models/User')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const bcrypt = require('bcrypt')
const validator = require('validator')
const activateMail= require('../config/activateMail')
const resetPassword= require('../config/resetPassword')
const redisClient = require('../config/redisConn')
const url = require('../config/url')

const createAccessToken = (_id) => jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
const createRefreshToken = (_id) => jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

const generateOTPToken = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const payload = { email, otp }
  const token = jwt.sign(payload, process.env.OTP_TOKEN_SECRET, { expiresIn: '5m' })
  return { otp, token }
}

const verificationStatus = {}

exports.login = async (req, res) => {
  try {
    const { email, password, token } = req.body
    const reCaptchaRe = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`, {
      headers: {"Content-Type": "application/x-www-form-urlencoded"}
    })

    if (reCaptchaRe.data.success && reCaptchaRe.data.score > 0.5) {
      const user = await User.login(email, password, res)
      const accessToken = createAccessToken(user._id)
      const refreshToken = createRefreshToken(user._id)

      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      res.status(200).json({name: user.name, email, roles: user.roles, accessToken})
    } else {
      throw Error('Google ReCaptcha Validation Failure')
    }
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const isNameEmpty = validator.isEmpty(name ?? '', { ignore_whitespace:true })
    const isEmailEmpty = validator.isEmpty(email ?? '', { ignore_whitespace:true })
    const isPasswordEmpty = validator.isEmpty(password ?? '', { ignore_whitespace:true })
    if (isNameEmpty || isEmailEmpty || isPasswordEmpty) throw Error('All fields must be filled')
    if (!validator.isEmail(email)) throw Error('Email not valid')
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough')
  
    const exists = await User.findOne({ email }).lean().exec()
    if (exists) throw Error('Email already in use')
  
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = { name, email, password: hashedPassword }
    const activation_token = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    
    const activateUrl = `${url}/activate/${activation_token}`
    activateMail.activateMailAccount(email, activateUrl, "Verify your email")

    res.status(200).json({ mailSent: true })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

exports.activate = async (req, res) => {
  try {
    const { activation_token } = req.body

    jwt.verify(activation_token, process.env.ACCESS_TOKEN_SECRET, 
      async (err, decoded) => {
        if (err?.name == "TokenExpiredError") return res.status(403).json({ error: 'Forbidden token expired'})
        if (err) return res.status(403).json({ error: 'Forbidden'})

        try {
          const user = await User.signup(decoded.name, decoded.email, decoded.password)
          const accessToken = createAccessToken(user._id)
          const refreshToken = createRefreshToken(user._id)

          res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
          res.status(200).json({name: user.name, email: user.email, roles: user.roles, accessToken})
        } catch (error) {
          res.status(400).json({error: error.message})
        }
      }
    )
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

exports.refresh = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(401).json({ error: 'Unauthorized Refresh token not found' })
  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken, 
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err?.name == "TokenExpiredError") return res.status(403).json({ error: 'Forbidden token expired' })
      if (err) return res.status(403).json({ error: 'Forbidden'})

      const foundUser = await User.findOne({ _id: decoded._id }).lean().exec()
      if (!foundUser) return res.status(401).json({ error: 'Unauthorized user not found' })

      if(foundUser.active){
        const accessToken = createAccessToken(foundUser._id)
        res.status(200).json({ name: foundUser.name, email: foundUser.email, roles: foundUser.roles, accessToken })
      }else{
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true })
        res.status(400).json({ error: 'Your account has been blocked' })
      }
    }
  )
}

exports.logout = async (req, res) => {
  const token = req.cookies.jwt
  if (!token) return res.sendStatus(204)
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true })
  res.status(200).json({ error: 'Logout successful '})
}

exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body
    let isEmailVerified = false

    verificationStatus[email] = { emailVerified: isEmailVerified }

    const isEmailEmpty = validator.isEmpty(email ?? '', { ignore_whitespace:true })
  
    if (isEmailEmpty) throw Error('Email Address Require')
    if (!validator.isEmail(email)) throw Error('Email not valid')
  
    const emailExist = await User.findOne({ email: email}).exec()
    if (!emailExist) throw Error('Email Address Not Found')
  
    if(!emailExist.active) return res.status(403).json({ error: 'Your account has been temporarily blocked. Please reach out to our Technical Support team for further assistance.', emailVerified: isEmailVerified })

    const now = new Date()
    const day = 24 * 60 * 60 * 1000

    if (emailExist.otp.requests >= 3 && emailExist.otp.requestDate && (now - emailExist.otp.requestDate) < day) {
      return res.status(429).json({ error: 'Too many OTP requests. Please try again tomorrow.', emailVerified: isEmailVerified })
    }

    if ((now - emailExist.otp.requestDate) >= day) {
      await User.updateOne({ email }, {$set: { 'otp.requests': 0}})
    }
  
    const { otp, token } = generateOTPToken(email)

    emailExist.otp.requests += 1
    emailExist.otp.requestDate = new Date()
    await emailExist.save()

    await redisClient.set(email, token, { EX: 300 })

    resetPassword.receiveOTP(email, otp)
    // console.log(`Generated OTP for ${req.ip}: ${otp}`);

    isEmailVerified = true
    verificationStatus[email].emailVerified = isEmailVerified
    res.status(200).json({ email, emailVerified: isEmailVerified })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body
    const email = req.email
    let isOtpVerified = false

    verificationStatus[email].otpVerified = isOtpVerified
    const otpToken = await redisClient.get(email)
    const isOtpEmpty = validator.isEmpty(otp ?? '', { ignore_whitespace:true })

    if (!otpToken || isOtpEmpty || otp.length < 6) return res.status(400).json({ error: 'Invalid OTP' })

    const emailExist = await User.findOne({ email: email}).exec()
    if(!emailExist || !emailExist.active) return res.status(403).json({ error: 'Your account has been blocked. Access has been prohibited for security reasons.', otpVerified: isOtpVerified })
    
    jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET, async (err, decoded) => {
      if (err || decoded.otp !== otp){
        const now = new Date()
        const day = 24 * 60 * 60 * 1000
    
        if (emailExist.otp.errorCount >= 3 && emailExist.otp.errorDate && (now - emailExist.otp.errorDate) < day) {
          await User.updateOne({ email }, {$set: { 'active': false }})
          return res.status(429).json({ error: "You've tried too many times with an incorrect OTP, this account has been temporarily blocked for security reasons. Please reach out to our Technical Support team for further assistance.", otpVerified: isOtpVerified })
        }
    
        if ((now - emailExist.otp.errorDate) >= day) {
          await User.updateOne({ email }, {$set: { 'otp.errorCount': 0}})
        }
        
        if(!emailExist.active) return res.status(403).json({ error: 'Your account has been temporarily blocked. Please reach out to our Technical Support team for further assistance.', otpVerified: isOtpVerified })
        
        emailExist.otp.errorCount += 1
        emailExist.otp.errorDate = new Date()
        await emailExist.save()

        return res.status(400).json({ error: 'Invalid or expired OTP' })
      }

      await redisClient.del(email)

      isOtpVerified = true
      verificationStatus[email].otpVerified = isOtpVerified
      res.status(200).json({ otpVerified: isOtpVerified })
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.restPassword = async (req, res) => {
  try {
    const { password } = req.body
    const email = req.email
    let isPasswordUpdated = false

    const isPasswordEmpty = validator.isEmpty(password ?? '', { ignore_whitespace:true })

    if (isPasswordEmpty) throw Error('Password Require')
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough')
  
    const emailExist = await User.findOne({ email: email }).lean()
    if(!emailExist || !emailExist.active) return res.status(403).json({ error: 'Your account has been blocked. Access has been prohibited for security reasons.', passwordUpdated: isPasswordUpdated })
  
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.updateOne({ email }, { $set: { 'password.hashed': hashedPassword } })

    delete verificationStatus[email]
    isPasswordUpdated = true
    res.status(200).json({ passwordUpdated: isPasswordUpdated })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.verificationStatus = verificationStatus