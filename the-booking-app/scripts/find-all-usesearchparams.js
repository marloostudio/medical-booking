const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Function to recursively search for files containing useSearchParams
function findFilesWithUseSearchParams(dir) {
  let results = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      results = results.concat(findFilesWithUseSearchParams(filePath))
    } else if (
      stat.isFile() &&
      (filePath.endsWith(".js") || filePath.endsWith(".jsx") || filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
    ) {
      const content = fs.readFileSync(filePath, "utf8")
      if (content.includes("useSearchParams")) {
        results.push(filePath)
      }
    }
  }

  return results
}

// Main function
function main() {
  console.log("Searching for files containing useSearchParams...")

  const rootDir = path.resolve(__dirname, "..")
  const files = findFilesWithUseSearchParams(rootDir)

  console.log(`Found ${files.length} files containing useSearchParams:`)
  files.forEach((file) => {
    const relativePath = path.relative(rootDir, file)
    console.log(`- ${relativePath}`)

    // Show the line containing useSearchParams
    const content = fs.readFileSync(file, "utf8")
    const lines = content.split("\n")
    lines.forEach((line, index) => {
      if (line.includes("useSearchParams")) {
        console.log(`  Line ${index + 1}: ${line.trim()}`)
      }
    })
  })

  // Suggest fixes
  console.log("\nSuggested fixes:")
  console.log("1. Wrap useSearchParams in a Suspense boundary")
  console.log("2. Replace useSearchParams with server-side props")
  console.log("3. Use the custom-build.js script to build without these files")
}

main()
