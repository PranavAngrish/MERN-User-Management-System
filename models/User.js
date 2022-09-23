const mongoose = require('mongoose')

const userSchema = new Schema({
    email: {
        typr: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    password: {
        typr: String,
        require: true,
        minlength: 6,
    }
})

module.exports = mongoose.model("user", userSchema)