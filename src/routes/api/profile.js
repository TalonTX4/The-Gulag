//imports
const express = require("express")
const jwtVerify = require("../../middleware/jwtVerify")
const config = require("config")
const router = express.Router()
const { check, validationResult } = require("express-validator")

const Profile = require("../../../models/Profile")
const User = require("../../../models/User")
const request = require("request")
const errorHandler = require("../../misc/errors")

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

    res.json(profile)
  } catch (err) {
    errorHandler.serverError(res, err)
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

    //TODO make all this into an iterative function

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
      errorHandler.serverError(res, err)
    }
  }
)

// @route  : GET api/profile
// @desc   : Get all profiles
// @access : Public
router.get("/", async (req, res) => {
  try {
    const userProfiles = await Profile.find().populate("user", [
      "name",
      "avatar",
    ])
    res.json(userProfiles)
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// @route  : GET api/profile/user/:user_id
// @desc   : Get profile by user id
// @access : Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const userProfile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"])

    if (!userProfile)
      return res.status(400).json({ msg: "there is no profile for this user" })

    res.json(userProfile)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "objectId") {
      return res.status(400).json({ msg: "profile not found" })
    }
    res.status(500).send(config.get("serverError"))
  }
})

// @route  : DELETE api/profile
// @desc   : Delete profile, user, and posts
// @access : Public
router.get("/", jwtVerify, async (req, res) => {
  try {
    // TODO - remove user posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: "user deleted" })
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// TODO dry checks in experience
// TODO update experience route

// @route  : PUT api/profile/experience
// @desc   : Add profile experience
// @access : Private
router.put(
  "/experience",
  [
    jwtVerify,
    [
      check("title", "title is required").not().isEmpty(),
      check("company", "company is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, company, location, from, to, current, description } =
      req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.experience.unshift(newExp)

      await profile.save

      res.json(profile)
    } catch (err) {
      errorHandler.serverError(res, err)
    }
  }
)

// @route  : DELETE api/profile/experience/:exp_id
// @desc   : delete a profile experience
// @access : Private
router.delete("/experience/:exp_id", jwtVerify, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

//TODO merge education and experience into 2 functions for inserting into an array field and deleting from one

// @route  : PUT api/profile/education
// @desc   : Add profile education
// @access : Private
router.put(
  "/education",
  [
    jwtVerify,
    [
      check("school", "school is required").not().isEmpty(),
      check("degree", "degree is required").not().isEmpty(),
      check("fieldOfStudy", "field of study is required").not().isEmpty(),
      check("from", "from date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { school, degree, fieldOfStudy, from, to, current, description } =
      req.body

    const newEdu = {
      school,
      degree,
      fieldOfStudy,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.education.unshift(newEdu)

      await profile.save

      res.json(profile)
    } catch (err) {
      errorHandler.serverError(res, err)
    }
  }
)

// @route  : DELETE api/profile/education/:edu_id
// @desc   : delete a profile education
// @access : Private
router.delete("/education/:edu_id", jwtVerify, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// @route  : GET api/profile/github/:username
// @desc   : get user repos from GitHub
// @access : Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No GitHub Profile found" })
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

module.exports = router
