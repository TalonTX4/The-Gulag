//imports
const express = require("express")
const router = express.Router()
const gravatar = require("gravatar")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

const User = require("../../../models/User")

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
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        try {
            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({
                    error: [{ msg: "User already exists" }],
                })
            }

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

            //return webtoken
            res.send("user roegistered")
        } catch (err) {
            console.error(err.message)
            res.status(500).send("server error")
        }
    },
)
module.exports = router
