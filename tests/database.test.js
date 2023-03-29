const connectDB = require("../database")
const config = require("config")

// test if database connector is not failing
test("database connector", () => {
  expect(connectDB()).toBe(config.get("databaseConnectSuccess"))
})
