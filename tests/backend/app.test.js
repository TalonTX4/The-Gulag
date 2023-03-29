const request = require("supertest")
const app = require("../../app")

let server

beforeAll(() => {
  server = app.listen(5000, (err) => {
    if (err) return err
  })
})

afterAll((done) => {
  server.close(done)
})

test("Server start", () => {})
