const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (app) => {
  app.use(
    createProxyMiddleware("/api", {
      target: `${process.env.HOST || "http://localhost"}:${
        process.env.PORT || 5000
      }`,
      changeOrigin: true,
    })
  )
}
