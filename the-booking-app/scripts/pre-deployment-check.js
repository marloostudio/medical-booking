const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔍 Running pre-deployment checks...")

// Array to collect all errors
const errors = []

// Function to run a command and capture its output
function runCommand(command, errorMessage) {
  try {
    return execSync(command, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] })
  } catch (error) {
    errors.push({
      type: errorMessage,
      details: error.stdout || error.stderr || error.message,
    })
    return ""
  }
}

// 1. Check for TypeScript errors
console.log("\n📝 Checking TypeScript compilation...")
runCommand("npx tsc --noEmit", "TypeScript Compilation Error")

// 2. Check for ESLint errors
console.log("\n🧹 Running ESLint...")
runCommand("npx eslint . --ext .ts,.tsx --max-warnings=0", "ESLint Error")

// 3. Check for unbalanced JSX/TSX tags and syntax errors
console.log("\n🔍 Checking for syntax errors in TypeScript files...")
const tsFiles = runCommand(
  'find . -type f -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v ".next"',
  "",
)
  .split("\n")
  .filter(Boolean)

tsFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf-8")

    // Check for unbalanced generic type parameters that might be confused with JSX
    if (content.includes("<T>") || content.includes("<T extends")) {
      console.log(`⚠️ Warning: File ${file} contains generic type parameters that might cause JSX parsing issues`)

      // Simple regex to detect potentially problematic generic syntax
      const genericMatches = content.match(/<T>|<T extends|<K,\s*V>|<T,|,\s*T>/g)
      if (genericMatches) {
        console.log(`   Found potentially problematic generic syntax: ${genericMatches.join(", ")}`)
      }
    }

    // Check for useSearchParams
    if (content.includes("useSearchParams")) {
      errors.push({
        type: "useSearchParams Usage",
        details: `File ${file} contains useSearchParams which can cause deployment issues`,
      })
    }
  } catch (error) {
    errors.push({
      type: "File Reading Error",
      details: `Error reading ${file}: ${error.message}`,
    })
  }
})

// 4. Run a test build
console.log("\n🏗️ Running a test build...")
runCommand("npx next build --no-lint", "Next.js Build Error")

// 5. Check for common Next.js deployment issues
console.log("\n🔍 Checking for common Next.js deployment issues...")

// Check for missing exports in page files
const pageFiles = runCommand('find app -type f -name "page.tsx" -o -name "page.js"', "").split("\n").filter(Boolean)
pageFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf-8")
    if (!content.includes("export default")) {
      errors.push({
        type: "Missing Export",
        details: `Page file ${file} is missing 'export default' for the page component`,
      })
    }
  } catch (error) {
    errors.push({
      type: "File Reading Error",
      details: `Error reading ${file}: ${error.message}`,
    })
  }
})

// Check for client components using server-only features
const clientFiles = runCommand('grep -l "use client" $(find app -type f -name "*.tsx" -o -name "*.js")', "")
  .split("\n")
  .filter(Boolean)
clientFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf-8")
    if (content.includes("headers()") || content.includes("cookies()")) {
      errors.push({
        type: "Server API in Client Component",
        details: `Client component ${file} uses server-only API (headers or cookies)`,
      })
    }
  } catch (error) {
    // Ignore errors for this check
  }
})

// Display results
console.log("\n📊 Pre-deployment check results:")

if (errors.length === 0) {
  console.log("✅ All checks passed! Your code should deploy without issues.")
} else {
  console.log(`❌ Found ${errors.length} potential issues that might cause deployment failures:`)

  errors.forEach((error, index) => {
    console.log(`\n${index + 1}. ${error.type}:`)
    console.log(`   ${error.details.replace(/\n/g, "\n   ")}`)
  })

  console.log("\n⚠️ Please fix these issues before deploying to avoid deployment failures.")
}
