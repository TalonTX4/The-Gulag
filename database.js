//imports
const config = require("config")
const mongoose = require("mongoose").default

// only use .env if not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const URI = process.env.MONGOURI

mongoose.set("strictQuery", false)

const connectDB = async () => {
  try {
    await mongoose.connect(URI)

    console.log(await config.get("databaseConnectSuccess"))
  } catch (err) {
    console.error(err.message)
    //exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
