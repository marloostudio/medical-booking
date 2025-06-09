const fs = require("fs")
const path = require("path")

console.log("🔍 Checking package compatibility...")

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"))
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

// Check React version
const reactVersion = dependencies.react
console.log(`📦 React version: ${reactVersion}`)

// Check for React 18 compatibility
const reactMajorVersion = Number.parseInt(reactVersion.replace(/[^\d]/g, "").charAt(0))
if (reactMajorVersion === 18) {
  console.log("✅ React 18 detected - Good for stability!")
} else if (reactMajorVersion === 19) {
  console.log("⚠️  React 19 detected - Consider downgrading for better ecosystem support")
} else {
  console.log("❌ Unsupported React version")
}

// Check critical packages
const criticalPackages = ["react-day-picker", "next", "@radix-ui/react-dialog", "react-hook-form"]

criticalPackages.forEach((pkg) => {
  if (dependencies[pkg]) {
    console.log(`✅ ${pkg}: ${dependencies[pkg]}`)
  } else {
    console.log(`❌ Missing: ${pkg}`)
  }
})

console.log("🎯 Compatibility check complete!")
