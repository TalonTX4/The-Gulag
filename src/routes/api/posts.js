//imports
const express = require("express")
const { check, validationResult } = require("express-validator")
const jwtVerify = require("../../middleware/jwtVerify")
const router = express.Router()
const User = require("../../../models/User")
const Post = require("../../../models/Post")
const errorHandler = require("../../misc/errors")

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
// @desc   : get all post
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
// @desc   : get post by id
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
// @desc   : delete a post by id
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

// @route  : PUT api/posts/like/:id
// @desc   : like a post
// @access : Private
router.put("/like/:id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    )
      return errorHandler.generic(res, "postLike")

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (err) {
    errorHandler.serverError(res, err)
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
    )
      return errorHandler.generic(res, "postUnlike")

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// @route  : POST api/posts/comment/:id
// @desc   : comment on a post
// @access : Private
router.post(
  "/comment/:id",
  [jwtVerify, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return errorHandler.validatorReturn(res, errors)

    try {
      const user = await User.findById(req.user.id).select("-password")
      const post = await Post.findById(req.params.id)

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }

      post.comments.unshift(newComment)

      await post.save()

      res.json(post.comments)
    } catch (err) {
      errorHandler.serverError(res, err)
    }
  }
)

// @route  : DELETE api/posts/comments/:id/:comment_id
// @desc   : delete a post by id
// @access : Private
router.delete("/comments/:id/:comment_id", jwtVerify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )

    //check if comment exists

    if (!comment) return errorHandler.notFound(res, "Comment")

    // Check user
    if (comment.user.toString() !== req.user.id)
      return errorHandler.authError(res)

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)

    post.comments.splice(removeIndex, 1)

    await post.save()

    res.json(post.comments)
  } catch (err) {
    errorHandler.serverObjectId(res, err, "Comment")
  }
})

module.exports = router
