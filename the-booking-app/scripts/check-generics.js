const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔍 Checking for problematic generic type syntax...")

// Find all TypeScript files
const tsFiles = execSync('find . -type f -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v ".next"', {
  encoding: "utf-8",
})
  .split("\n")
  .filter(Boolean)

const problematicFiles = []

tsFiles.forEach((file) => {
  try {
    const content = fs.readFileSync(file, "utf-8")

    // Check for potentially problematic generic syntax
    const genericMatches = content.match(/<T>|<T,|<T\s+extends|<K,\s*V>|<T,|,\s*T>/g)

    if (genericMatches) {
      problematicFiles.push({
        file,
        matches: genericMatches,
      })
    }
  } catch (error) {
    console.error(`Error reading ${file}: ${error.message}`)
  }
})

if (problematicFiles.length === 0) {
  console.log("✅ No problematic generic syntax found.")
} else {
  console.log(`⚠️ Found ${problematicFiles.length} files with potentially problematic generic syntax:`)

  problematicFiles.forEach(({ file, matches }) => {
    console.log(`\n${file}:`)
    console.log(`   Found: ${matches.join(", ")}`)
    console.log("   Suggestion: Use explicit type constraints like <T extends unknown> or add type aliases")
  })

  console.log("\nTo fix these issues:")
  console.log("1. Replace <T> with <T extends unknown>")
  console.log("2. For multiple type parameters, use type aliases or add spaces: <T, K> instead of <T,K>")
  console.log("3. Consider moving complex generic types to separate type aliases")
}
