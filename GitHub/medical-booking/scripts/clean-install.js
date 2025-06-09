const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🧹 Starting clean installation...")

// Remove node_modules and lock files
const filesToRemove = ["node_modules", "package-lock.json", ".next"]

filesToRemove.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`🗑️  Removing ${file}...`)
    execSync(`rm -rf ${filePath}`, { stdio: "inherit" })
  }
})

// Clean npm cache
console.log("🧽 Cleaning npm cache...")
execSync("npm cache clean --force", { stdio: "inherit" })

// Fresh install
console.log("📦 Installing dependencies...")
execSync("npm install", { stdio: "inherit" })

console.log("✅ Clean installation complete!")
