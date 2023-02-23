const config = require("config")

class errorHandler {
  // Generic server error to be used in a try catch
  static serverError(res, err) {
    console.error(err.message)
    res.status(500).send(config.get("errorResponses.serverError"))
  }
}

module.exports = errorHandler
