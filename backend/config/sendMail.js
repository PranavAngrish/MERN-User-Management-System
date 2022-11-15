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
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet" />
                    <title>Account Activation</title>
                    <style>
                        body {
                            background-color: #333333;
                            height: 100vh;
                            font-family: "Roboto", sans-serif;
                            color: #fff;
                            position: relative;
                            text-align: center;
                        }

                        .container {
                            max-width: 700px;
                            width: 100%;
                            height: 100%;
                            margin: 0 auto;
                        }

                        .wrapper {
                            padding: 0 15px;
                        }

                        .card {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 100%;
                        }

                        span {
                            color: #3292ec;
                        }

                        .btn-txt-color {
                            color: white;
                        }

                        button {
                            padding: 1em 6em;
                            border-radius: 5px;
                            border: 0;
                            background-color: #0184ff;
                            transition: all 0.3s ease-in;
                            cursor: pointer;
                        }

                        button:hover {
                            background-color: #51a7f8;
                            transition: all 0.3s ease-in;
                        }

                        .prompt-color {
                            color: #3292ec;
                        }

                        .spacing {
                            margin-top: 4rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="wrapper">
                            <div class="card">
                                <h1><span>Verify your email</span></h1>
                                <h3>Welcome! and thank you for signup</h3>
                                <p>Just click the button below to complete the signup process.</p>
                                <p class="prompt-color">The link will expire in 15 minutes.</p>
                                <a href=${url}><button class="btn-txt-color">${text}</button></a>
                                <p class="spacing">If the button above does not work, please navigate to the link provided below 👇🏻</p>
                                <div>${url}</div>
                            </div>
                        </div>
                    </div>   
                </body>
            </html>
        `,
    } 

    smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) return { err }
        return info
    })
}

module.exports = { sendEmailRegister }