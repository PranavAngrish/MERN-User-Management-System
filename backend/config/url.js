const port = process.env.REACT_PORT
const dev = process.env.NODE_ENV !== 'production'
const url = dev ? `http://localhost:${port}/` : ''

module.exports = url