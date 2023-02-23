const config = require("config")

class errorHandler {
  static serverError(err, res) {
    console.error(err.message)
    res.status(500).send(config.get("errorResponses.serverError"))
  }
}

module.exports = errorHandler
