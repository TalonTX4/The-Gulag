//imports
const express = require("express")
const router = express.Router()
const User = require("../../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require("express-validator")
const jwtVerify = require("../../middleware/jwtVerify")
const errorHandler = require("../../misc/errors")

// only use .env if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

// @route  : GET api/auth
// @desc   : Get user by token
// @access : Private
router.get("/", jwtVerify, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// @route  : POST api/auth
// @desc   : Authenticate user & get token
// @access : Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return errorHandler.validatorReturn(res, errors)

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) return errorHandler.authError(res)

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) return errorHandler.authError(res)

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: process.env.TOKENDURATION },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      errorHandler.serverError(res, err)
    }
  }
)

module.exports = router
