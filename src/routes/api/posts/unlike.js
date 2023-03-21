// imports
const express = require("express")
const jwtVerify = require("../../../middleware/jwtVerify")
const Post = require("../../../../models/Post")
const errorHandler = require("../../../misc/errors")
const router = express.Router()

// @route  : PUT api/posts/unlike.js/:id
// @desc   : Unlike a post
// @access : Private
router.put("/:id", jwtVerify, async (req, res) => {
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

// export router
module.exports = router
