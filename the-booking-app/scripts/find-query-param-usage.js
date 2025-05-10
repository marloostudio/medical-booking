// This script finds query parameter usage in the codebase
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// This is just a script, not a component using useSearchParams
console.log("Scanning for query parameter usage...")

// Patterns to search for
const patterns = ["searchParams", "useSearchParams", "query\\.", "params\\.", "URLSearchParams"]

// Search for each pattern
patterns.forEach((pattern) => {
  try {
    console.log(`\nSearching for ${pattern}...`)
    const result = execSync(`grep -r "${pattern}" --include="*.tsx" --include="*.jsx" --include="*.js" .`).toString()

    const files = result
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [filePath] = line.split(":")
        return filePath
      })
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

    console.log(`Found ${files.length} files using ${pattern}:`)
    files.forEach((file) => console.log(file))
  } catch (error) {
    console.log(`No files found using ${pattern}`)
  }
})
