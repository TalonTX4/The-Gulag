// imports
const express = require("express")
const connectDB = require("./database")

const app = express()

// Connect Database
connectDB()

app.get("/", (req, res) => res.send("API running"))

// use environment port or 5000
const PORT = process.env.PORT || 5000

//NOTE ${varName} adds in the varName variable to the string (only works with `` (tilde) not "" (quotes))
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
