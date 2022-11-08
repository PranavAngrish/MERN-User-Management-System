const nodemailer = require("nodemailer")
const { google } = require("googleapis")
const { OAuth2 } = google.auth

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground"
const { G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, ADMIN_EMAIL } = process.env

const oauth2client = new OAuth2(
    G_CLIENT_ID,
    G_CLIENT_SECRET,
    G_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

const sendEmailRegister = (to, url, text) => {
    try {
        oauth2client.setCredentials({ refresh_token: G_REFRESH_TOKEN })
        const accessToken = oauth2client.getAccessToken() 
        const smtpTransport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: ADMIN_EMAIL,
                clientId: G_CLIENT_ID,
                clientSecret: G_CLIENT_SECRET,
                refreshToken: G_REFRESH_TOKEN,
                accessToken,
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
      
        const info = smtpTransport.sendMail(mailOptions)
        return info 
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = sendEmailRegister