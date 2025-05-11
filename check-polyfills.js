const fs = require("fs")
const path = require("path")

// List of polyfills needed for the project
const polyfills = [
  "crypto-browserify",
  "stream-browserify",
  "path-browserify",
  "browserify-zlib",
  "stream-http",
  "https-browserify",
  "os-browserify",
  "buffer",
]

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, "node_modules")
if (!fs.existsSync(nodeModulesPath)) {
  console.error("node_modules directory not found! Run npm install first.")
  process.exit(1)
}

// Check which polyfills are missing
const missingPolyfills = polyfills.filter((polyfill) => {
  try {
    require.resolve(polyfill)
    return false // Polyfill is installed
  } catch (e) {
    return true // Polyfill is missing
  }
})

if (missingPolyfills.length > 0) {
  console.error(`Missing polyfills: ${missingPolyfills.join(", ")}`)
  console.error('Run "node install-polyfills.js" to install them.')
  process.exit(1)
} else {
  console.log("All polyfills are installed.")
}
