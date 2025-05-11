const { execSync } = require("child_process")
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

// Check if package.json exists
const packageJsonPath = path.join(__dirname, "package.json")
if (!fs.existsSync(packageJsonPath)) {
  console.error("package.json not found!")
  process.exit(1)
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

// Check which polyfills are missing
const missingPolyfills = polyfills.filter((polyfill) => !dependencies[polyfill])

if (missingPolyfills.length === 0) {
  console.log("All polyfills are already installed.")
  process.exit(0)
}

// Install missing polyfills
console.log(`Installing missing polyfills: ${missingPolyfills.join(", ")}`)
try {
  execSync(`npm install --save ${missingPolyfills.join(" ")}`, { stdio: "inherit" })
  console.log("Successfully installed all missing polyfills.")
} catch (error) {
  console.error("Failed to install polyfills:", error)
  process.exit(1)
}
