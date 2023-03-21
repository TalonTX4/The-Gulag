//imports
const jwt = require("jsonwebtoken")

// only use .env if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

module.exports = function (req, res, next) {
  // Get token form header
  const token = req.header("x-auth-token")

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" })
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWTSECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" })
      } else {
        req.user = decoded.user
        next()
      }
    })
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}
