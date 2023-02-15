// imports
const express = require("express")

const app = express()

app.get("/", (req, res) => res.send("API running"))

// use environment port or 5000
const PORT = process.env.PORT || 5000

//NOTE ${varName} adds in the varName variable to the string (only works with `` (tilde) not "" (quotes))
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
