const request = require("supertest")
const app = require("../../../../app")
const dbConnector = require("../../../db-connector")

let mockId
let mockPostId
let mockCommentId

jest.mock("../../../../middleware/jwtVerify", () => async (req, res, next) => {
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
  mockCommentId = await dbConnector.testComment()
})

afterEach(async () => {
  jest.restoreAllMocks()
  await dbConnector.clearDatabase()
})

test("Server start", () => {})

describe("POST api/posts/comment/:id", () => {
  test("normal case", (done) => {
    request(server)
      .post(`/api/posts/comment/${mockPostId}`)
      .send({
        text: "comment text",
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test("no text case", (done) => {
    request(server)
      .post(`/api/posts/comment/${mockPostId}`)
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

describe("DELETE api/posts/comment/:id/:comment_id", () => {
  // TODO: normal, no comment, and bad user cases
  /*  test("normal case", (done) => {
    request(server)
      .del(`/api/posts/comment/${mockPostId}/${mockCommentId}`)
      .send({})
      .expect((res) => {
        console.log(res.body)
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test("no comment case", (done) => {
    request(server)
      .post(`/api/posts/comment/${mockPostId}/${mockCommentId}`)
      .send({})
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })

  test("Bad user case", (done) => {
    request(server)
      .post(`/api/posts/comment/${mockPostId}/${mockCommentId}`)
      .send({})
      .expect(400)
      .end((err) => {
        if (err) return done(err)
        return done()
      })
  })*/
})
