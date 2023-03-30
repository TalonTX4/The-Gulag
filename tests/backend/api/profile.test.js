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
  server = app.listen(5003, (err) => {
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

describe("POST api/profile", () => {
  test("normal case", (done) => {
    let userObj = {
      status: "manager",
      skills: "css, ruby, javascript",
      company: "google",
      website: "catPics.com",
      bio: "generic bio",
      githubUsername: "bill97",
      facebook: "facebook.com/bill",
    }
    request(server)
      .post("/api/profile")
      .send(userObj)
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("missing status case", (done) => {
    let userObj = {
      skills: "css, ruby, javascript",
      company: "google",
      website: "catPics.com",
      bio: "generic bio",
      githubUsername: "bill97",
      facebook: "facebook.com/bill",
    }
    request(server)
      .post("/api/profile")
      .send(userObj)
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("missing skills case", (done) => {
    let userObj = {
      status: "manager",
      company: "google",
      website: "catPics.com",
      bio: "generic bio",
      githubUsername: "bill97",
      facebook: "facebook.com/bill",
    }
    request(server)
      .post("/api/profile")
      .send(userObj)
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
describe("GET api/profile", () => {
  test("normal case", (done) => {
    request(server)
      .get("/api/profile")
      .send({})
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
describe("DELETE api/profile", () => {
  test("normal case", (done) => {
    request(server)
      .del("/api/profile")
      .send({})
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
