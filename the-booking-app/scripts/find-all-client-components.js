// This script finds all client components in the codebase
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// This is just a script, not a component using useSearchParams
console.log("Scanning for client components...")

// Use grep to find all files with "use client"
try {
  const result = execSync('grep -r "use client" --include="*.tsx" --include="*.jsx" --include="*.js" .').toString()

  const clientComponents = result
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [filePath] = line.split(":")
      return filePath
    })

  console.log(`Found ${clientComponents.length} client components:`)
  clientComponents.forEach((file) => console.log(file))

  // Now check which ones use useSearchParams
  console.log("\nChecking for useSearchParams usage...")

  const componentsWithSearchParams = clientComponents.filter((file) => {
    const content = fs.readFileSync(file, "utf8")
    return content.includes("useSearchParams")
  })

  console.log(`Found ${componentsWithSearchParams.length} components using useSearchParams:`)
  componentsWithSearchParams.forEach((file) => console.log(file))
} catch (error) {
  console.error("Error scanning for client components:", error)
}
