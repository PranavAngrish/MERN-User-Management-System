const router = require('express').Router()
const authController = require('../controllers/auth')
const loginLimiter = require('../middleware/loginLimiter')

router.route('/login').post(loginLimiter, authController.login)
router.route('/signup').post(loginLimiter, authController.signup)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)

module.exports = router