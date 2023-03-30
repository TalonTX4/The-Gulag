const mongoose = require("mongoose").default
const { MongoMemoryServer } = require("mongodb-memory-server")
const User = require("../models/User")
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")

let mongo
let user
let name = "bill"
let email = "bill@removeme.com"
let password = "password123"

/**
 * Connect to the in-memory database.
 */
const connect = async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()

  mongoose.set("strictQuery", false)

  await mongoose.connect(uri)
}

/**
 * Drop database, close the connection and stop mongod.
 */
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongo.stop()
}

/**
 * Remove all the data for all db collections.
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}
/**
 * Fill Database with temp data
 */
const fillDatabase = async () => {
  const avatar = gravatar.url(email, {
    s: "200",
    r: "X",
    d: "mm",
  })

  user = new User({
    name,
    email,
    avatar,
    password,
  })

  const salt = await bcrypt.genSalt(10)

  user.password = await bcrypt.hash(password, salt)

  await user.save()
}

const testUser = async () => {
  let testUser = await User.findOne({ email })
  return testUser.id
}

module.exports = {
  fillDatabase,
  connect,
  closeDatabase,
  clearDatabase,
  testUser,
}
