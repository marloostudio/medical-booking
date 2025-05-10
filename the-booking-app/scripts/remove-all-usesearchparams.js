const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Find all files that contain useSearchParams
console.log("Finding all files with useSearchParams...")
const grepCommand =
  'grep -r "useSearchParams" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . | grep -v "node_modules" | grep -v ".next"'

try {
  const grepOutput = execSync(grepCommand, { encoding: "utf-8" })
  const affectedFiles = new Set()

  grepOutput.split("\n").forEach((line) => {
    if (!line) return
    const filePath = line.split(":")[0]
    if (filePath) {
      affectedFiles.add(filePath)
    }
  })

  console.log(`Found ${affectedFiles.size} files with useSearchParams:`)
  affectedFiles.forEach((file) => console.log(`- ${file}`))

  // Process each file
  affectedFiles.forEach((filePath) => {
    console.log(`\nProcessing ${filePath}...`)
    let content = fs.readFileSync(filePath, "utf-8")

    // Check if this is a client component
    const isClientComponent = content.includes('"use client"')

    // Replace imports
    content = content.replace(
      /import\s*{\s*([^}]*)\s*useSearchParams\s*([^}]*)\s*}\s*from\s*['"]next\/navigation['"]/g,
      (match, before, after) => {
        const newImport = `import { ${before}${after} } from 'next/navigation'`
        return newImport.replace(/{\s*,\s*}/g, "{ }").replace(/{\s*}/g, "")
      },
    )

    // Replace useSearchParams hook usage
    if (isClientComponent) {
      // For client components, replace with a dummy function
      content = content.replace(/const\s+(\w+)\s*=\s*useSearchParams$$$$/g, "const $1 = { get: (key) => null }")

      // Replace any direct calls
      content = content.replace(/useSearchParams$$$$/g, "{ get: (key) => null }")

      // Replace any usage of searchParams.get
      content = content.replace(/(\w+)\.get$$['"](\w+)['"]$$/g, 'null /* Removed searchParams.get("$2") */')
    }

    // Write the modified content back to the file
    fs.writeFileSync(filePath, content, "utf-8")
    console.log(`Modified ${filePath}`)
  })

  console.log("\nAll useSearchParams instances have been removed or replaced.")
} catch (error) {
  console.error("Error:", error.message)
}
