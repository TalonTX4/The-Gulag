const config = require("config")

class errorHandler {
  // Generic server error to be used in a try catch
  static serverError(res, err) {
    console.error(err.message)
    res.status(500).send(config.get("errorResponses.serverError"))
  }

  // Error handler for when there could be a object not found error in a catch block
  static serverObjectId(res, err, ObjectName) {
    console.error(err.message)
    if (err.kind === "objectId") {
      return res.status(400).json({ msg: `${ObjectName} not found` })
    }
    res.status(500).send(config.get("errorResponses.serverError"))
  }
}

module.exports = errorHandler
