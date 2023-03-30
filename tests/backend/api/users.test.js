const request = require("supertest")
const app = require("../../../app")
const dbConnector = require("../../db-connector")

let server

beforeAll(async () => {
  server = app.listen(5004, (err) => {
    if (err) return err
  })
  await dbConnector.connect()
})

afterAll(async () => {
  await server.close()
  await dbConnector.closeDatabase()
})

beforeEach(async () => {
  await dbConnector.fillDatabase()
})

afterEach(async () => {
  jest.restoreAllMocks()
  await dbConnector.clearDatabase()
})

test("Server start", () => {})
describe("POST api/users", () => {
  test("normal case", (done) => {
    request(server)
      .post("/api/users")
      .send({
        name: "steve",
        email: "steve@gmail.com",
        password: "password123",
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("no name case", (done) => {
    request(server)
      .post("/api/users")
      .send({
        email: "steve@gmail.com",
        password: "password123",
      })
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("bad email case", (done) => {
    request(server)
      .post("/api/users")
      .send({
        name: "steve",
        email: "steve",
        password: "password123",
      })
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("short password case", (done) => {
    request(server)
      .post("/api/users")
      .send({
        name: "steve",
        email: "steve@gmail.com",
        password: "p",
      })
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("email in use case", (done) => {
    request(server)
      .post("/api/users")
      .send({
        name: "steve",
        email: "bill@removeme.com",
        password: "password123",
      })
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
