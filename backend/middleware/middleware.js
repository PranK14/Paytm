const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

function AuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({})
  }
  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT)

    req.userId = decoded.userId
    next()
  } catch (e) {
    res.status(403).json({ msg: 'Unauthorized User' })
  }
}

module.exports = AuthMiddleware
