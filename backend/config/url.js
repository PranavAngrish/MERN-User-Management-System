const port = process.env.PORT || 4000
const dev = process.env.NODE_ENV !== 'production'
const url = dev ? `http://localhost:${port}/` : ''

module.exports = url