// imports
const express = require("express")
const connectDB = require("./database")
const app = express()
const config = require("config")
const path = require("path")

// Connect Database
connectDB().then()

// init middleware
app.use(express.json({ extended: false }))

// define routes
//NOTE this is the good way to pass app to api lol
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("../client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// use port in env or port set in config
const PORT = process.env.PORT || config.get("backendConnector.serverPort")

//NOTE ${varName} adds in the varName variable to the string (only works with `` (tilde) not "" (quotes))
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
