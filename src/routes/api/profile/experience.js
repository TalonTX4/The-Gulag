// imports
const express = require("express")
const jwtVerify = require("../../../middleware/jwtVerify")
const { check, validationResult } = require("express-validator")
const errorHandler = require("../../../misc/errors")
const Profile = require("../../../../models/Profile")
const router = express.Router()

// @route  : PUT api/profile/experience
// @desc   : Add profile experience
// @access : Private
router.put(
  "/",
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
    if (!errors.isEmpty()) return errorHandler.validatorReturn(res, errors)

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
// @desc   : Delete a profile experience
// @access : Private
router.delete("/:exp_id", jwtVerify, async (req, res) => {
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

// export router
module.exports = router
