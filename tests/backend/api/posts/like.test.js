const request = require("supertest")
const app = require("../../../../app")
const dbConnector = require("../../../db-connector")

let mockId
let mockPostId

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
})

afterEach(async () => {
  jest.restoreAllMocks()
  await dbConnector.clearDatabase()
})

test("Server start", () => {})

describe("PUT api/posts/like/:id", () => {
  test("liking case", (done) => {
    request(server)
      .put(`/api/posts/like/${mockPostId}`)
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

  // TODO: test case where post already liked
})
