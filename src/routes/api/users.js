//imports
const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator/check")

// @route  : POST api/users
// @desc   : register user
// @access : public
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a vaild email").isEmail(),
        check(
            "password",
            "Please enter a password with 2 or more characters",
        ).isLength({ min: 2 }),
    ],
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        res.send("user route")
    },
)
module.exports = router
