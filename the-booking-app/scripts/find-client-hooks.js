// This script finds client hooks usage in the codebase
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// This is just a script, not a component using useSearchParams
console.log("Scanning for client hooks usage...")

// List of client hooks to search for
const clientHooks = [
  "useSearchParams",
  "usePathname",
  "useRouter",
  "useParams",
  "useSelectedLayoutSegment",
  "useSelectedLayoutSegments",
]

// Search for each hook
clientHooks.forEach((hook) => {
  try {
    console.log(`\nSearching for ${hook}...`)
    const result = execSync(`grep -r "${hook}" --include="*.tsx" --include="*.jsx" --include="*.js" .`).toString()

    const files = result
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [filePath] = line.split(":")
        return filePath
      })
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

    console.log(`Found ${files.length} files using ${hook}:`)
    files.forEach((file) => console.log(file))
  } catch (error) {
    console.log(`No files found using ${hook}`)
  }
})
