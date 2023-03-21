// imports
const express = require("express")
const jwtVerify = require("../../../middleware/jwtVerify")
const Profile = require("../../../../models/Profile")
const errorHandler = require("../../../misc/errors")
const router = express.Router()

// @route  : GET api/profile/me
// @desc   : Get current users profile
// @access : Private
router.get("/", jwtVerify, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    )

    if (!profile) return errorHandler.notFound(res, "Profile")

    res.json(profile)
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// export router
module.exports = router
