// This script finds all useSearchParams usage in the codebase
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// This is just a script, not a component using useSearchParams
console.log("Scanning for useSearchParams usage...")

try {
  const result = execSync('grep -r "useSearchParams" --include="*.tsx" --include="*.jsx" --include="*.js" .').toString()

  const files = result
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [filePath] = line.split(":")
      return filePath
    })
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

  console.log(`Found ${files.length} files using useSearchParams:`)
  files.forEach((file) => console.log(file))

  // Check if they're wrapped in Suspense
  console.log("\nChecking if components are wrapped in Suspense...")

  files.forEach((file) => {
    if (!file || !fs.existsSync(file)) return

    const content = fs.readFileSync(file, "utf8")
    const isClientComponent = content.includes("use client")
    const usesSuspense = content.includes("<Suspense")

    console.log(`${file}:`)
    console.log(`  Client Component: ${isClientComponent ? "Yes" : "No"}`)
    console.log(`  Uses Suspense: ${usesSuspense ? "Yes" : "No"}`)
    console.log(`  Status: ${isClientComponent && !usesSuspense ? "NEEDS FIXING" : "OK"}`)
  })
} catch (error) {
  console.error("Error scanning for useSearchParams:", error)
}
