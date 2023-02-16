//imports
const express = require("express")
const router = express.Router()
const User = require("../../../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require("express-validator")
const jwtVerify = require("../../middleware/jwtVerify")

// @route  : GET api/auth
// @desc   : Test route
// @access : public
router.get("/", jwtVerify, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(config.get("serverError"))
  }
})

// @route  : POST api/auth
// @desc   : Authenticate user & get token
// @access : public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({
          error: [{ msg: config.get("authError") }],
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({
          error: [{ msg: config.get("authError") }],
        })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      //TODO change expire time to 3600 (1 hour) before going into production

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send(config.get("serverError"))
    }
  }
)

module.exports = router
