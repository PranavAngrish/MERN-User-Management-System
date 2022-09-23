
const User = require("../models/User")

exports.signup_get = (req, res) => {
    res.render('sigup')
}

exports.signup_post = async (req, res) => {
    res.send('sigup')
}

exports.login_get = (req, res) => {
    res.render('login')
}

exports.login_post = async (req, res) => {
    res.send('login')
}