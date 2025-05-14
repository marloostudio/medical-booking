const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Starting clean build process...")

// Clean .next directory
console.log("Cleaning .next directory...")
if (fs.existsSync(path.join(process.cwd(), ".next"))) {
  fs.rmSync(path.join(process.cwd(), ".next"), { recursive: true, force: true })
  console.log(".next directory removed")
} else {
  console.log(".next directory does not exist")
}

// Clean node_modules
console.log("Cleaning node_modules directory...")
if (fs.existsSync(path.join(process.cwd(), "node_modules"))) {
  fs.rmSync(path.join(process.cwd(), "node_modules"), { recursive: true, force: true })
  console.log("node_modules directory removed")
} else {
  console.log("node_modules directory does not exist")
}

// Clear npm cache
console.log("Clearing npm cache...")
try {
  execSync("npm cache clean --force", { stdio: "inherit" })
  console.log("npm cache cleared")
} catch (error) {
  console.error("Error clearing npm cache:", error)
}

// Install dependencies
console.log("Installing dependencies...")
try {
  execSync("npm install", { stdio: "inherit" })
  console.log("Dependencies installed")
} catch (error) {
  console.error("Error installing dependencies:", error)
  process.exit(1)
}

// Build the project
console.log("Building the project...")
try {
  execSync("npm run build", { stdio: "inherit" })
  console.log("Build completed successfully")
} catch (error) {
  console.error("Error building the project:", error)
  process.exit(1)
}

console.log("Clean build process completed successfully!")
