// imports
const express = require("express")
const config = require("config")
const path = require("path")
const app = require("./app")
const connectDB = require("./database")

// Connect Database
connectDB().then()

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// use port in env or port set in config
const PORT = process.env.PORT || config.get("backendConnector.serverPort")

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
