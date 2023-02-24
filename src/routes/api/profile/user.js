// imports
const express = require("express")
const Profile = require("../../../../models/Profile")
const errorHandler = require("../../../misc/errors")
const router = express.Router()

// @route  : GET api/profile/user/:user_id
// @desc   : Get profile by user id
// @access : Public
router.get("/:user_id", async (req, res) => {
  try {
    const userProfile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"])

    if (!userProfile) return errorHandler.notFound(res, "Profile")

    res.json(userProfile)
  } catch (err) {
    errorHandler.serverObjectId(res, err, "Profile")
  }
})

// export router
module.exports = router
