const User = require('../models/User')
const jwt = require('jsonwebtoken')
const axios = require('axios')

const createRefreshToken = (_id) => jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

exports.login = async (req, res) => {
  const { email, password, tokens } = req.body

  try {
    const reCaptchaRe = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${tokens}`, {
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
    })

    if (reCaptchaRe.data.success && reCaptchaRe.data.score > 0.5) {
      const user = await User.login(email, password)
      const accessToken = jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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
  const {name, email, password} = req.body

  try {
    const user = await User.signup(name, email, password)
    const accessToken = jwt.sign({_id: user._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
    const refreshToken = createRefreshToken(user._id)
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'Lax', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.status(200).json({name: user.name, email, roles: user.roles, accessToken})
  } catch (error) {
    if(error.message === "Email already in use") res.status(409).json({error: error.message})
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
        const accessToken = jwt.sign({_id: foundUser._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
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