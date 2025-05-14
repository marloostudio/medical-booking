const fs = require("fs")
const path = require("path")

// List of environment files to keep
const filesToKeep = [".env.development", ".env.production"]

// Get all .env* files
const envFiles = fs
  .readdirSync(".")
  .filter((file) => file.startsWith(".env") || file.endsWith(".env") || file.includes(".env."))

console.log("Found environment files:", envFiles)

// Delete all except the ones to keep
envFiles.forEach((file) => {
  if (!filesToKeep.includes(file)) {
    try {
      fs.unlinkSync(file)
      console.log(`Deleted: ${file}`)
    } catch (err) {
      console.error(`Error deleting ${file}:`, err)
    }
  }
})

console.log("Environment files cleanup complete!")
console.log("Kept files:", filesToKeep)
