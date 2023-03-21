// imports
const express = require("express")
const router = express.Router()
const jwtVerify = require("../../../middleware/jwtVerify")
const { check, validationResult } = require("express-validator")
const errorHandler = require("../../../misc/errors")
const User = require("../../../../models/User")
const Post = require("../../../../models/Post")

// @route  : POST api/posts/comment/:id
// @desc   : Comment on a post
// @access : Private
router.post(
  "/:id",
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
// @desc   : Delete a comment
// @access : Private
router.delete("/:id/:comment_id", jwtVerify, async (req, res) => {
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
