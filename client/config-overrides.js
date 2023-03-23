/* config-overrides.js */
process.env.NODE_CONFIG_DIR = "../config"
const config = require("config")
const fs = require("fs")
const path = require("path")

const configData = JSON.stringify(config)

fs.writeFileSync(path.resolve(__dirname, "src/client.json"), configData)

const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin")

module.exports = function override(settings, env) {
  settings.resolve.plugins = settings.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  )
  settings.resolve = {
    fallback: { path: require.resolve("path-browserify") },
    alias: { config: path.resolve(__dirname, "src/client.json") },
  }
  //do stuff with the webpack config...
  return settings
}
