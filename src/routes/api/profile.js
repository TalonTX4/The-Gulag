//imports
const express = require("express")
const jwtVerify = require("../../middleware/jwtVerify")
const config = require("config")
const router = express.Router()
const { check, validationResult } = require("express-validator")

const Profile = require("../../../models/Profile")
const User = require("../../../models/User")

// @route  : GET api/profile/me
// @desc   : get current users profile
// @access : private
router.get("/me", jwtVerify, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    )

    if (!profile) {
      return res.status(400).json({ msg: "there is no profile for this user" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send(config.get("serverError"))
  }
})

// @route  : POST api/profile
// @desc   : create or update user profile
// @access : private

router.post(
  "/",
  [
    jwtVerify,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "skills are required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)

module.exports = router
