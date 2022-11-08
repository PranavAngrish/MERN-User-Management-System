const User = require('../models/User')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { sendMail } = require('../config/sendMail')
const { url } = require('../config/url')

const createAccessToken = (_id) => jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
const createRefreshToken = (_id) => jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

exports.login = async (req, res) => {
  const { email, password, tokens } = req.body

  try {
    const reCaptchaRe = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokens}`, {
      headers: {"Content-Type": "application/x-www-form-urlencoded"}
    })

    if (reCaptchaRe.data.success && reCaptchaRe.data.score > 0.5) {
      const user = await User.login(email, password)
      // const accessToken = jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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
  const { name, email, password } = req.body

  try {
    const isNameEmpty = validator.isEmpty(name ?? '', { ignore_whitespace:true })
    const isEmailEmpty = validator.isEmpty(email ?? '', { ignore_whitespace:true })
    const isPasswordEmpty = validator.isEmpty(password ?? '', { ignore_whitespace:true })
    if (isNameEmpty || isEmailEmpty || isPasswordEmpty) throw Error('All fields must be filled')
    if (!validator.isEmail(email)) throw Error('Email not valid')
    if (!validator.isStrongPassword(password)) throw Error('Password not strong enough')
  
    const exists = await User.findOne({ email }).lean().exec()
    if (exists) throw Error('Email already in use')
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = { name, email, password: hash }
    const activation_token = jwt.sign(newUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    
    const activateUrl = `${url}/activate/${activation_token}`
    sendMail.sendEmailRegister(email, activateUrl, "Verify your email")

    res.status(200).json({ msg: "Welcome! Please check your email." })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

exports.activate = async (req, res) => {
  const { activation_token } = req.body

  try {
    const user = await User.signup(name, email, password)
    // const accessToken = jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const accessToken = createAccessToken(user._id)
    const refreshToken = createRefreshToken(user._id)

    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.status(200).json({name: user.name, email, roles: user.roles, accessToken})
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
        // const accessToken = jwt.sign({_id: foundUser._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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