const { logEvents } = require('./logger')

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode  = statusCode 
    }
}

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    // logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(res.statusCode)
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    return res.status(statusCode).json({ error: message, stack: process.env.NODE_ENV === 'production' ? null :  err.stack })
}

module.exports = { CustomError, errorHandler, notFound } 