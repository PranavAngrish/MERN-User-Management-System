const nodemailer = require("nodemailer")
const { ADMIN_EMAIL, ADMIN_PASS } = process.env

const sendEmailRegister = (to, url, text) => {
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: ADMIN_EMAIL,
            pass: ADMIN_PASS
        }
    }) 

    const mailOptions = {
        from: ADMIN_EMAIL,
        to: to,
        subject: "ACCOUNT ACTIVATION",
        text: "ACCOUNT ACTIVATION TESTING 123",
        html: `
            <h1>ACCOUNT ACTIVATION TESTING 123</h1>
            <a href=${url}>${text}</a>
        `,
    } 

    smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) return { err }
        return info
    })
}

module.exports = { sendEmailRegister }