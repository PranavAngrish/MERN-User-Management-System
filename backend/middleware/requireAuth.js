const jwt = require('jsonwebtoken')
const User = require('../models/user/User')
const { CustomError } = require('./errorHandler')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) throw new CustomError('Request is not authorized', 401)

  const token = authorization.split(' ')[1]

  jwt.verify(
    token, 
    process.env.ACCESS_TOKEN_SECRET, 
    async (err, decoded) => {
      if (err?.name == "TokenExpiredError") throw new CustomError('Forbidden token expired', 403)
      if (err) return res.status(403).json({ error: 'Forbidden'})

      const checkActive = await User.findOne({ _id: decoded.userInfo._id }).select('_id active roles').lean().exec()
      if (!checkActive) throw new CustomError('Unauthorized user not found', 401)
      
      if(checkActive.active){
        req.user = checkActive._id
        req.roles = checkActive.roles
        if (!req.user._id) throw new CustomError('Unauthorized User ID', 401)
        if(!req.roles) throw new CustomError('Unauthorized Roles', 401)
        next()
      } else{
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true })
        throw new CustomError('Your account has been blocked', 400)
      }
  })
}

module.exports = requireAuth