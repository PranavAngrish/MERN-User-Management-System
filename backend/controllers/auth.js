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

exports.login = async (req, res) => {
  try {
    const { email, password, token } = req.body
    const reCaptchaRe = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`, {
      headers: {"Content-Type": "application/x-www-form-urlencoded"}
    })

    if (reCaptchaRe.data.success && reCaptchaRe.data.score > 0.5) {
      const user = await User.login(email, password)
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

const generateOTPToken = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const payload = { email, otp }
  const token = jwt.sign(payload, process.env.OTP_TOKEN_SECRET, { expiresIn: '5m' })
  return { otp, token }
}

exports.recoverEmail = async (req, res) => {
  try {
    const { email } = req.body
    
    const isEmailEmpty = validator.isEmpty(email, { ignore_whitespace:true })
  
    if (isEmailEmpty) throw Error('Email Address Require')
    if (!validator.isEmail(email)) throw Error('Email not valid')
  
    const emailExist = await User.findOne({ email: email}).exec()
    if (!emailExist) throw Error('Email Address Not Found')
  
    // if(!emailExist.active) throw Error('Your account has been blocked')

    const now = new Date()
    if (emailExist.otpRequests > 3 && emailExist.otpRequestDate && now - emailExist.otpRequestDate < 24 * 60 * 60 * 1000) {
      return res.status(429).json({ error: 'Too many OTP requests. Please try again tomorrow.' })
    }

    if (now - emailExist.otpRequestDate >= 24 * 60 * 60 * 1000) {
      emailExist.otpRequests = 0
    }
  
    const { otp, token } = generateOTPToken(email)

    emailExist.otpRequests += 1
    emailExist.otpRequestDate = new Date()
    await emailExist.save()

    await redisClient.set(email, token, { EX: 300 })

    resetPassword.receiveOTP(email, otp)
    // console.log(`Generated OTP for ${req.ip}: ${otp}`);

    res.status(200).json({ email, mailVerify: true })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body

  try {
    const otpToken = await redisClient.get(email)
    if (!otpToken) return res.status(400).json({ error: 'Invalid or expired OTP' })

    jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET, async (err, decoded) => {
      if (err || decoded.otp !== otp) return res.status(400).json({ error: 'Invalid or expired OTP' })

      await redisClient.del(email)

      res.status(200).json({ optVerified: true })
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.restPassword = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(password, typeof password)
    const isEmailEmpty = validator.isEmpty(email, { ignore_whitespace:true })
    const isPasswordEmpty = validator.isEmpty(password ?? '', { ignore_whitespace:true })

    if (isEmailEmpty) throw Error('Email Address Require')
    if (!validator.isEmail(email)) throw Error('Email not valid')

    if (isPasswordEmpty) throw Error('Password Require')
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough')
  
    const emailExist = await User.findOne({ email: email }).lean()
    if (!emailExist) throw Error('Email Address Not Found')
  
    const hashedPassword = await bcrypt.hash(password, 10)

    await User.updateOne({ email }, { password: hashedPassword })

    res.status(200).json({ passwordUpdated: true })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}