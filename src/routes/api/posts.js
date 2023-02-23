//imports
const express = require("express")
const { check, validationResult } = require("express-validator")
const jwtVerify = require("../../middleware/jwtVerify")
const router = express.Router()
const Profile = require("../../../models/Profile")
const User = require("../../../models/User")
const Post = require("../../../models/Post")
const config = require("config")

// @route  : POST api/posts
// @desc   : Create a post
// @access : Private
router.post(
  "/",
  [jwtVerify, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

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
      console.error(err.message)
      res.status(500).send(config.get("serverError"))
    }
  }
)

// @route  : GET api/posts
// @desc   : get all post
// @access : Private
router.get("/", jwtVerify, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })

    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(config.get("serverError"))
  }
})

// @route  : GET api/posts/:id
// @desc   : get post by id
// @access : Private
router.get("/:id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: "post not found" })
    }

    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" })
    }
    res.status(500).send(config.get("serverError"))
  }
})

// @route  : DELETE api/posts/:id
// @desc   : delete a post by id
// @access : Private
router.delete("/:id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: "Post not found" })
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    await post.remove()

    res.json({ msg: "post removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "post not found" })
    }
    res.status(500).send(config.get("serverError"))
  }
})

// @route  : PUT api/posts/like/:id
// @desc   : like a post
// @access : Private
router.put("/like/:id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400)({ msg: "post already liked" })
    }

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(config.get("serverError"))
  }
})

// @route  : PUT api/posts/unlike/:id
// @desc   : unlike a post
// @access : Private
router.put("/unlike/:id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400)({ msg: "post has not yet been liked" })
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send(config.get("serverError"))
  }
})

module.exports = router
