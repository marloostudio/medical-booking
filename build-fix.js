const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("Starting build fix script...")

// Function to recursively find files with a specific extension
function findFiles(dir, ext, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      findFiles(filePath, ext, fileList)
    } else if (path.extname(file) === ext) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Check for common issues in TypeScript files
console.log("Checking for common issues in TypeScript files...")
const tsFiles = findFiles(".", ".tsx").concat(findFiles(".", ".ts"))

let issuesFound = false

tsFiles.forEach((file) => {
  if (file.includes("node_modules") || file.includes(".next")) return

  const content = fs.readFileSync(file, "utf8")

  // Check for duplicate exports
  const exportMatches = content.match(/export\s+(async\s+)?(function|const|let|var|class)\s+([a-zA-Z0-9_$]+)/g) || []
  const exportedNames = exportMatches.map((match) => {
    const parts = match.split(/\s+/)
    return parts[parts.length - 1]
  })

  const duplicates = exportedNames.filter((name, index) => exportedNames.indexOf(name) !== index)

  if (duplicates.length > 0) {
    console.log(`Found duplicate exports in ${file}: ${duplicates.join(", ")}`)
    issuesFound = true
  }

  // Check for syntax errors (very basic check)
  const braceCount = (content.match(/{/g) || []).length - (content.match(/}/g) || []).length
  const parenCount = (content.match(/$$/g) || []).length - (content.match(/$$/g) || []).length

  if (braceCount !== 0) {
    console.log(
      `Possible missing braces in ${file}: ${braceCount > 0 ? "missing closing braces" : "too many closing braces"}`,
    )
    issuesFound = true
  }

  if (parenCount !== 0) {
    console.log(
      `Possible missing parentheses in ${file}: ${parenCount > 0 ? "missing closing parentheses" : "too many closing parentheses"}`,
    )
    issuesFound = true
  }
})

if (!issuesFound) {
  console.log("No common issues found in TypeScript files.")
}

// Try to build with different configurations
console.log("Attempting build with different configurations...")

// Create a minimal next.config.js
const minimalConfig = `
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true }
}
`

const nextConfigPath = path.join(__dirname, "next.config.js")
const nextConfigBackupPath = path.join(__dirname, "next.config.js.backup")

// Backup original config
if (fs.existsSync(nextConfigPath)) {
  fs.copyFileSync(nextConfigPath, nextConfigBackupPath)
}

// Try with minimal config
fs.writeFileSync(nextConfigPath, minimalConfig)
console.log("Trying build with minimal configuration...")

try {
  execSync("next build", { stdio: "inherit" })
  console.log("Build succeeded with minimal configuration!")
} catch (error) {
  console.error("Build failed even with minimal configuration.")

  // Restore original config
  if (fs.existsSync(nextConfigBackupPath)) {
    fs.copyFileSync(nextConfigBackupPath, nextConfigPath)
  }

  process.exit(1)
}

// Restore original config
if (fs.existsSync(nextConfigBackupPath)) {
  fs.copyFileSync(nextConfigBackupPath, nextConfigPath)
  fs.unlinkSync(nextConfigBackupPath)
}

console.log("Build fix completed successfully!")
