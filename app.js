// imports
const express = require("express")
const app = express()

// init middleware
app.use(express.json({ extended: false }))

// define routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))

module.exports = app
