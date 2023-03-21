//imports
const express = require("express")
const { check, validationResult } = require("express-validator")
const jwtVerify = require("../../middleware/jwtVerify")
const router = express.Router()
const User = require("../../../models/User")
const Post = require("../../../models/Post")
const errorHandler = require("../../misc/errors")

// sub-routes
router.use("/comment", require("./posts/comment"))
router.use("/like", require("./posts/like"))
router.use("/unlike", require("./posts/unlike"))

// @route  : POST api/posts
// @desc   : Create a post
// @access : Private
router.post(
  "/",
  [jwtVerify, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return errorHandler.validatorReturn(res, errors)

    try {
      const user = await User.findById(req.user.id).select("-password")

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })

      const post = await newPost.save()

      res.json(post)
    } catch (err) {
      errorHandler.serverError(err, res)
    }
  }
)

// @route  : GET api/posts
// @desc   : Get all post
// @access : Private
router.get("/", jwtVerify, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })

    res.json(posts)
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// @route  : GET api/posts/:id
// @desc   : Get post by id
// @access : Private
router.get("/:id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return errorHandler.notFound(res, "Post")

    res.json(post)
  } catch (err) {
    errorHandler.serverObjectId(res, err, "Post")
  }
})

// @route  : DELETE api/posts/:id
// @desc   : Delete a post by id
// @access : Private
router.delete("/:id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return errorHandler.notFound(res, "Post")

    // Check user
    if (post.user.toString() !== req.user.id) return errorHandler.authError(res)

    await post.remove()

    res.json({ msg: "post removed" })
  } catch (err) {
    errorHandler.serverObjectId(res, err, "Post")
  }
})

module.exports = router
