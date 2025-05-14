const fs = require("fs")
const path = require("path")

console.log("Starting environment files cleanup...")

// Only keep these essential files
const essentialFiles = [".env.development", ".env.production"]

// Get all .env* files
const allEnvFiles = fs
  .readdirSync(".")
  .filter((file) => file.startsWith(".env") || file.endsWith(".env") || file.includes(".env."))

console.log("Found environment files:", allEnvFiles)

// Delete all except essential files
allEnvFiles.forEach((file) => {
  if (!essentialFiles.includes(file)) {
    try {
      fs.unlinkSync(file)
      console.log(`Deleted: ${file}`)
    } catch (err) {
      console.error(`Error deleting ${file}:`, err)
    }
  }
})

console.log("Environment files cleanup complete!")
console.log("Kept essential files:", essentialFiles)
