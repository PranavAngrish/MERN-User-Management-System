const jwt = require('jsonwebtoken')
const User = require('../models/user/User')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization.startsWith('Bearer ')) return res.status(401).json({error: 'Request is not authorized'})

  const token = authorization.split(' ')[1]

  jwt.verify(
    token, 
    process.env.ACCESS_TOKEN_SECRET, 
    async (err, decoded) => {
      if (err?.name == "TokenExpiredError") return res.status(403).json({ error: 'Forbidden token expired'})
      if (err) return res.status(403).json({ error: 'Forbidden'})

      const checkActive = await User.findOne({ _id: decoded.userInfo._id }).select('_id active roles').lean().exec()
      if (!checkActive) return res.status(401).json({ error: 'Unauthorized user not found' })
      
      if(checkActive.active){
        req.user = checkActive._id
        req.roles = checkActive.roles
        if (!req.user._id) return res.status(401).json({ error: 'Unauthorized User ID' })
        if(!req.roles) return res.status(401).json({ error: 'Unauthorized Roles' })
        next()
      } else{
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Lax', secure: true })
        res.status(400).json({ error: 'Your account has been blocked' })
      }
  })
}

module.exports = requireAuth