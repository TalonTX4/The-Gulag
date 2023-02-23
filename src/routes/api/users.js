//imports
const express = require("express")
const router = express.Router()
const gravatar = require("gravatar")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")

const User = require("../../../models/User")
const errorHandler = require("../../misc/errors")

// @route  : POST api/users
// @desc   : register user
// @access : public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 2 or more characters"
    ).isLength({ min: 2 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) return errorHandler.authError()

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
      errorHandler.serverError(res, err)
    }
  }
)
module.exports = router
