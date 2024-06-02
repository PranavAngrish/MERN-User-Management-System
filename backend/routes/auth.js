const router = require('express').Router()
const authController = require('../controllers/auth')
const loginLimiter = require('../middleware/loginLimiter')

router.post('/login', loginLimiter, authController.login)
router.post('/signup', loginLimiter, authController.signup)
router.post('/activate', authController.activate)
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)
router.post('/verify-email', authController.recoverEmail)
router.post('/verify-OTP', authController.verifyOTP)
router.post('/rest-password', authController.restPassword)

module.exports = router