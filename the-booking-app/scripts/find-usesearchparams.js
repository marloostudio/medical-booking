// This script finds useSearchParams usage in the codebase
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// This is just a script, not a component using useSearchParams
console.log("Scanning for useSearchParams usage in client components...")

try {
  // First find all client components
  const clientComponentsResult = execSync(
    'grep -r "use client" --include="*.tsx" --include="*.jsx" --include="*.js" .',
  ).toString()

  const clientComponents = clientComponentsResult
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [filePath] = line.split(":")
      return filePath
    })
    .filter(Boolean)

  console.log(`Found ${clientComponents.length} client components`)

  // Then check which ones use useSearchParams
  const componentsWithSearchParams = clientComponents.filter((file) => {
    if (!fs.existsSync(file)) return false
    const content = fs.readFileSync(file, "utf8")
    return content.includes("useSearchParams")
  })

  console.log(`\nFound ${componentsWithSearchParams.length} client components using useSearchParams:`)
  componentsWithSearchParams.forEach((file) => console.log(file))

  // Check if parent components use Suspense
  console.log("\nChecking if parent components use Suspense...")

  componentsWithSearchParams.forEach((file) => {
    const dirPath = path.dirname(file)
    const fileName = path.basename(file)
    const componentName = path.basename(file, path.extname(file))

    // Look for potential parent files
    const parentFiles = fs
      .readdirSync(dirPath)
      .filter((f) => (f !== fileName && f.endsWith(".tsx")) || f.endsWith(".jsx") || f.endsWith(".js"))

    console.log(`\nComponent: ${file}`)
    console.log("Potential parent files:")

    parentFiles.forEach((parentFile) => {
      const parentPath = path.join(dirPath, parentFile)
      const content = fs.readFileSync(parentPath, "utf8")

      const importsComponent =
        content.includes(`import ${componentName}`) ||
        content.includes(`from './${componentName}'`) ||
        content.includes(`from "./${componentName}"`)

      const usesSuspense = content.includes("<Suspense")

      console.log(`  ${parentPath}:`)
      console.log(`    Imports Component: ${importsComponent ? "Yes" : "No"}`)
      console.log(`    Uses Suspense: ${usesSuspense ? "Yes" : "No"}`)
      console.log(`    Status: ${importsComponent && !usesSuspense ? "NEEDS FIXING" : "OK"}`)
    })
  })
} catch (error) {
  console.error("Error scanning for useSearchParams:", error)
}
