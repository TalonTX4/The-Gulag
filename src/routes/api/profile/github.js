// imports
const express = require("express")
const config = require("config")
const request = require("request")
const errorHandler = require("../../../misc/errors")
const router = express.Router()

// @route  : GET api/profile/github/:username
// @desc   : Get user repos from GitHub
// @access : Public
router.get("/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode !== 200)
        return errorHandler.notFound(res, "GitHub Profile")

      res.json(JSON.parse(body))
    })
  } catch (err) {
    errorHandler.serverError(res, err)
  }
})

// export router
module.exports = router
