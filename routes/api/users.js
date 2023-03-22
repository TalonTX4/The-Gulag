//imports
const express = require("express")
const router = express.Router()
const gravatar = require("gravatar")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const User = require("../../models/User")
const errorHandler = require("../../misc/errors")

// only use .env if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const passMinLength = config.get("client.passwordRestrictions.charMin")

// @route  : POST api/users
// @desc   : Register user
// @access : public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      `Please enter a password with ${passMinLength} or more characters`
    ).isLength({ min: passMinLength }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return errorHandler.validatorReturn(res, errors)

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) return errorHandler.authError(res)

      const avatar = gravatar.url(email, {
        s: "200",
        r: "X",
        d: "mm",
      })

      user = new User({
        name,
        email,
        avatar,
        password,
      })

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: config.get("jwtTokenDuration") },
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
