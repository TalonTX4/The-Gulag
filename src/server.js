// imports
const express = require("express")
const connectDB = require("./database")

const app = express()

// Connect Database
connectDB()

// init middleware
app.use(express.json({ extended: false }))

app.get("/", (req, res) => res.send("API running"))

// define routes
//NOTE this is the good way to pass app to api lol
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/profile", require("./routes/api/profile"))
app.use("/api/posts", require("./routes/api/posts"))

// use environment port or 5000
const PORT = process.env.PORT || 5000

//NOTE ${varName} adds in the varName variable to the string (only works with `` (tilde) not "" (quotes))
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
