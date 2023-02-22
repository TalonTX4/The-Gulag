//imports
const express = require("express")
const { check, validationResult } = require("express-validator")
const jwtVerify = require("../../middleware/jwtVerify")
const router = express.Router()
const Profile = require("../../../models/Profile")
const User = require("../../../models/User")
const Post = require("../../../models/Post")

// @route  : GET api/posts
// @desc   : Test route
// @access : public
router.get("/", (req, res) => res.send("posts route"))

module.exports = router
