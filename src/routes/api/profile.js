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

    //TODO make all this into a recursive function

    const {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body

    // build profile object
    const profileFields = {}
    profileFields.user = req.user.id

    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubUsername) profileFields.githubUsername = githubUsername
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim())
    }

    // build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (twitter) profileFields.social.twitter = twitter
    if (instagram) profileFields.social.instagram = instagram
    if (linkedin) profileFields.social.linkedin = linkedin

    //NOTE changed profile to userProfile to clear ambiguity with Profile

    try {
      let userProfile = await Profile.findOne({ user: req.user.id })

      if (userProfile) {
        // Update
        userProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )

        return res.json(userProfile)
      }

      //create
      userProfile = new Profile(profileFields)

      await userProfile.save()
      return res.json(userProfile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send(config.get("serverError"))
    }
  }
)

// @route  : GET api/profile
// @desc   : Get all profiles
// @access : private

router.get("/", async (req, res) => {
  try {
    const userProfile = await Profile.find().populate("user", [
      "name",
      "avatar",
    ])
    res.json(userProfile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(config.get("serverError"))
  }
})

module.exports = router
