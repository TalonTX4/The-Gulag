const request = require("supertest")
const app = require("../../../app")
const dbConnector = require("../../db-connector")

let mockId
let mockPostId

jest.mock("../../../middleware/jwtVerify", () => async (req, res, next) => {
  req.user = { id: await mockId }
  return next()
})

let server

beforeAll(async () => {
  server = app.listen(0, (err) => {
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
  mockPostId = await dbConnector.testPost()
})

afterEach(async () => {
  jest.restoreAllMocks()
  await dbConnector.clearDatabase()
})

test("Server start", () => {})

describe("POST api/posts", () => {
  test("normal case", (done) => {
    let inputText = "post body"
    request(server)
      .post("/api/posts")
      .send({
        text: inputText,
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("no text case", (done) => {
    request(server)
      .post("/api/posts")
      .send({
        text: "",
      })
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
describe("GET api/posts", () => {
  test("normal case", (done) => {
    request(server)
      .get("/api/posts")
      .send({})
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
describe("GET api/posts/:id", () => {
  test("normal case", (done) => {
    request(server)
      .get(`/api/posts/${mockPostId}`)
      .send({})
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("bad id case", (done) => {
    request(server)
      .get(`/api/posts/invalidPostId`)
      .send({})
      .expect(404)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
describe("DELETE api/posts/:id", () => {
  test("normal case", (done) => {
    request(server)
      .del(`/api/posts/${mockPostId}`)
      .send({})
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
  test("bad id case", (done) => {
    request(server)
      .del(`/api/posts/invalidPostId`)
      .send({})
      .expect(404)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })
})
