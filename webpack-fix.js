const fs = require("fs")
const path = require("path")

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

console.log(`${colors.bright}${colors.blue}Checking for common webpack issues...${colors.reset}`)

// Function to check for circular dependencies
function checkCircularDependencies(dir, visited = new Set(), path = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    if (file.isDirectory() && !file.name.startsWith("node_modules") && !file.name.startsWith(".")) {
      checkCircularDependencies(path.join(dir, file.name), visited, path)
    } else if (file.name.endsWith(".js") || file.name.endsWith(".ts") || file.name.endsWith(".tsx")) {
      const filePath = path.join(dir, file.name)
      const content = fs.readFileSync(filePath, "utf8")

      // Simple check for imports that might cause circular dependencies
      const imports = content.match(/import .* from ['"](.*)['"];?/g) || []

      for (const importStatement of imports) {
        const importPath = importStatement.match(/from ['"](.*)['"];?/)[1]
        if (importPath.startsWith(".") && visited.has(importPath)) {
          console.log(`${colors.yellow}Potential circular dependency detected:${colors.reset}`)
          console.log(`  ${filePath} imports ${importPath}`)
        }
        visited.add(importPath)
      }
    }
  }
}

// Check for missing dependencies
function checkMissingDependencies() {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

  // Common dependencies that might be missing
  const commonDeps = [
    "@hookform/resolvers",
    "next",
    "react",
    "react-dom",
    "typescript",
    "tailwindcss",
    "postcss",
    "autoprefixer",
    "firebase",
    "next-auth",
  ]

  const missingDeps = commonDeps.filter((dep) => !dependencies[dep])

  if (missingDeps.length > 0) {
    console.log(`${colors.yellow}Potentially missing dependencies:${colors.reset}`)
    missingDeps.forEach((dep) => console.log(`  - ${dep}`))
  } else {
    console.log(`${colors.green}✓ No common dependencies missing${colors.reset}`)
  }
}

// Check for webpack configuration issues
function checkWebpackConfig() {
  try {
    const nextConfig = fs.readFileSync("next.config.js", "utf8")

    // Check for common webpack configuration issues
    const issues = []

    if (nextConfig.includes("serverExternalPackages")) {
      issues.push("serverExternalPackages is not a valid property in Next.js config")
    }

    if (nextConfig.includes("esmExternals")) {
      issues.push("esmExternals might cause compatibility issues")
    }

    if (nextConfig.includes("topLevelAwait")) {
      issues.push("topLevelAwait might cause build issues in some environments")
    }

    if (issues.length > 0) {
      console.log(`${colors.yellow}Potential webpack configuration issues:${colors.reset}`)
      issues.forEach((issue) => console.log(`  - ${issue}`))
    } else {
      console.log(`${colors.green}✓ No common webpack configuration issues detected${colors.reset}`)
    }
  } catch (error) {
    console.error(`${colors.red}Error checking webpack configuration:${colors.reset}`, error)
  }
}

// Run checks
checkMissingDependencies()
checkWebpackConfig()
console.log(`${colors.yellow}Checking for circular dependencies (this may take a moment)...${colors.reset}`)
checkCircularDependencies(".")
console.log(`${colors.bright}${colors.blue}Webpack issue check completed!${colors.reset}`)
