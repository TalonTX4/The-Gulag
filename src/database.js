//imports
const mongoose = require("mongoose").default
const config = require("config")
const URI = config.get("mongoURI")

mongoose.set("strictQuery", false)

const connectDB = async () => {
    try {
        await mongoose.connect(URI)

        console.log("mongoDB connected...")
    } catch (err) {
        console.error(err.message)
        //exit process with failure
        process.exit(1)
    }
}

module.exports = connectDB
