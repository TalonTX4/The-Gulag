// imports
const express = require("express")
const jwtVerify = require("../../../middleware/jwtVerify")
const Post = require("../../../models/Post")
const errorHandler = require("../../../misc/errors")
const router = express.Router()

// @route  : PUT api/posts/like/:id
// @desc   : Like a post
// @access : Private
router.put("/:id", jwtVerify, async (req, res) => {
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

// export router
module.exports = router
