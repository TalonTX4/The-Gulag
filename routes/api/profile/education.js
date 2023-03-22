// imports
const express = require("express")
const jwtVerify = require("../../../middleware/jwtVerify")
const { check, validationResult } = require("express-validator")
const errorHandler = require("../../../misc/errors")
const Profile = require("../../../models/Profile")
const router = express.Router()

// @route  : PUT api/profile/education
// @desc   : Add profile education
// @access : Private
router.put(
  "/",
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
    if (!errors.isEmpty()) return errorHandler.validatorReturn(res, errors)

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
// @desc   : Delete a profile education
// @access : Private
router.delete("/:edu_id", jwtVerify, async (req, res) => {
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

// export router
module.exports = router
