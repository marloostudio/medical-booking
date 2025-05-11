const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Check if package-lock.json exists and remove it
const packageLockPath = path.join(__dirname, "package-lock.json")
if (fs.existsSync(packageLockPath)) {
  console.log("Removing package-lock.json...")
  fs.unlinkSync(packageLockPath)
}

// Check if node_modules exists and remove it
const nodeModulesPath = path.join(__dirname, "node_modules")
if (fs.existsSync(nodeModulesPath)) {
  console.log("Removing node_modules...")
  fs.rmSync(nodeModulesPath, { recursive: true, force: true })
}

// Run npm install
console.log("Running npm install...")
execSync("npm install", { stdio: "inherit" })

console.log("Dependencies cleaned up successfully!")
