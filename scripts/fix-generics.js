const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🔧 Fixing problematic generic type syntax...")

// Find all TypeScript files
const tsFiles = execSync('find . -type f -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v ".next"', {
  encoding: "utf-8",
})
  .split("\n")
  .filter(Boolean)

let fixedFiles = 0

tsFiles.forEach((file) => {
  try {
    let content = fs.readFileSync(file, "utf-8")
    const originalContent = content

    // Fix common generic syntax issues

    // Replace <T> with <T extends unknown>
    content = content.replace(/<T>/g, "<T extends unknown>")

    // Add space after commas in generic type parameters
    content = content.replace(/<([A-Za-z0-9_]+),([A-Za-z0-9_]+)>/g, "<$1, $2>")

    // Fix function generic syntax
    content = content.replace(/function\s+([A-Za-z0-9_]+)<T>/g, "function $1<T extends unknown>")

    // Fix method generic syntax
    content = content.replace(/([A-Za-z0-9_]+)<T>\(/g, "$1<T extends unknown>(")

    // Fix arrow function generic syntax
    content = content.replace(/const\s+([A-Za-z0-9_]+)\s*=\s*<T>/g, "const $1 = <T extends unknown>")

    if (content !== originalContent) {
      fs.writeFileSync(file, content, "utf-8")
      console.log(`✅ Fixed generic syntax in: ${file}`)
      fixedFiles++
    }
  } catch (error) {
    console.error(`Error processing ${file}: ${error.message}`)
  }
})

if (fixedFiles === 0) {
  console.log("ℹ️ No files needed fixing.")
} else {
  console.log(`🎉 Fixed generic syntax in ${fixedFiles} files.`)
}
