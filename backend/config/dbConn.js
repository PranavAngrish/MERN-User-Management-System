const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch((error) => console.log(error))
}

module.exports = connectDB