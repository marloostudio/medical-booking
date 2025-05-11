const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🧹 Cleaning project...")

// Remove .next directory
if (fs.existsSync(".next")) {
  console.log("Removing .next directory...")
  fs.rmSync(".next", { recursive: true, force: true })
}

// Remove node_modules
if (fs.existsSync("node_modules")) {
  console.log("Removing node_modules directory...")
  fs.rmSync("node_modules", { recursive: true, force: true })
}

// Remove package-lock.json
if (fs.existsSync("package-lock.json")) {
  console.log("Removing package-lock.json...")
  fs.unlinkSync("package-lock.json")
}

// Install dependencies
console.log("📦 Installing dependencies...")
execSync("npm install", { stdio: "inherit" })

console.log("✅ Project reset complete! You can now run:")
console.log("npm run dev")
