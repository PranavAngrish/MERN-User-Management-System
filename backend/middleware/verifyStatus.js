const validator = require('validator')
const { verificationStatus } = require('../controllers/auth')

const validateEmail = (email) => {
    const isEmailEmpty = validator.isEmpty(email ?? '', { ignore_whitespace:true })
    if (isEmailEmpty) return res.status(400).json({ error: "Email Address Require" })

    if (!validator.isEmail(email)) return res.status(400).json({ error: "Email not valid" })
    
    return email
}

exports.emailVerifiedStatus = (req, res, next) => {
    const { email } = req.body

    const verifiedEmail = validateEmail(email)

    if (!verificationStatus[verifiedEmail] || !verificationStatus[verifiedEmail].emailVerified) return res.status(401).json({ error: "Your account has been blocked. For security reasons, the page will redirect to a 404 page soon.", otpVerified: false })
    
    req.email = verifiedEmail

    next()
}

exports.otpVerifiedtatus = (req, res, next) => {
    const { email } = req.body

    const verifiedEmail = validateEmail(email)

    if (!verificationStatus[verifiedEmail] || !verificationStatus[verifiedEmail].otpVerified) return res.status(401).json({ error: "Your account has been blocked. For security reasons, the page will redirect to a 404 page soon.", passwordUpdated: false })

    req.email = verifiedEmail

    next()
}
