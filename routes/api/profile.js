//imports
const express = require("express")
const jwtVerify = require("../../middleware/jwtVerify")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const constructors = require("../../misc/constructors")
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const errorHandler = require("../../misc/errors")

// TODO dry checks in experience
// TODO update experience route
// TODO merge education and experience into 2 functions for inserting into an array field and deleting from one

// sub-routes
router.use("/experience", require("./profile/experience"))
router.use("/education", require("./profile/education"))
router.use("/github", require("./profile/github"))
router.use("/me", require("./profile/me"))
router.use("/user", require("./profile/user"))

// @route  : POST api/profile
// @desc   : Create or update user profile
// @access : Private
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
    if (!errors.isEmpty()) return errorHandler.validatorReturn(res, errors)

    // build profile object
    const profileFields = {}

    // add skills since they cant be added with the constructor
    const { skills } = req.body
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim())
    }

    // fill user id reference
    profileFields.user = req.user.id

    // construct basic top level fields
    let basicFields = ["company", "website", "bio", "status", "githubUsername"]
    constructors.profileFields(req, profileFields, basicFields)

    // build social object
    profileFields.social = {}
    let socialFields = ["youtube", "twitter", "facebook", "linkedin"]
    constructors.profileFields(req, profileFields.social, socialFields)

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

// @route  : DELETE api/profile
// @desc   : Delete profile, user, and posts
// @access : Private
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

module.exports = router
