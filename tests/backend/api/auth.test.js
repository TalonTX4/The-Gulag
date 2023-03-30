const request = require("supertest")
const app = require("../../../app")
const dbConnector = require("../../db-connector")

let mockId

jest.mock("../../../middleware/jwtVerify", () => async (req, res, next) => {
  req.user = { id: await mockId }
  return next()
})

let server

beforeAll(async () => {
  server = app.listen(5000, (err) => {
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
  mockId = await dbConnector.testUser()
})

afterEach(async () => {
  jest.restoreAllMocks()
  await dbConnector.clearDatabase()
})

test("Server start", () => {})

describe("GET api/auth", () => {
  test("normal case", (done) => {
    request(server)
      .get("/api/auth")
      .send()
      .expect(200)
      .expect((res) => {
        res.body.name = "bill"
        res.body.email = "bill@removeme.com"
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})

describe("POST api/auth", () => {
  test("normal case", (done) => {
    request(server)
      .post("/api/auth")
      .send({
        email: "bill@removeme.com",
        password: "password123",
      })
      .expect(200)
      .expect((res) => {
        res.body.token != null
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("missing password case", (done) => {
    request(server)
      .post("/api/auth")
      .send({
        email: "bill@removeme.com",
      })
      .expect(400)
      .expect((res) => {
        res.body.error != null
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("bad email case", (done) => {
    request(server)
      .post("/api/auth")
      .send({
        email: "bill jenkins",
        password: "password123",
      })
      .expect(400)
      .expect((res) => {
        res.body.error != null
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("no user found case", (done) => {
    request(server)
      .post("/api/auth")
      .send({
        email: "alice@removeme.org",
        password: "password123",
      })
      .expect(400)
      .expect((res) => {
        res.body.error != null
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("mismatched password case", (done) => {
    request(server)
      .post("/api/auth")
      .send({
        email: "bill@removeme.com",
        password: "wrongPassword",
      })
      .expect(400)
      .expect((res) => {
        res.body.error != null
      })
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
