const User = require('../models/User')

const requireRoles = (Roles) => {
    return (req, res, next) => {
        const checkRoles = req.roles.find(role => Roles.includes(role))
        if(!checkRoles) return res.status(401).json({ error: 'Unauthorized Roles' })
        next()
    }
}

module.exports = requireRoles