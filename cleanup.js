const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("Starting project cleanup...")

// 1. Remove .babelrc file
const babelrcPath = path.join(process.cwd(), ".babelrc")
if (fs.existsSync(babelrcPath)) {
  console.log("Removing .babelrc file...")
  fs.unlinkSync(babelrcPath)
}

// 2. Remove any babel.config.js file
const babelConfigPath = path.join(process.cwd(), "babel.config.js")
if (fs.existsSync(babelConfigPath)) {
  console.log("Removing babel.config.js file...")
  fs.unlinkSync(babelConfigPath)
}

// 3. Remove duplicate icon files
const iconFiles = [
  "app/dashboard/patients/icon.js",
  "app/dashboard/patients/icon.jsx",
  "app/dashboard/patients/icon.tsx",
]

iconFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`Removing duplicate file: ${file}`)
    fs.unlinkSync(filePath)
  }
})

// 4. Remove pnpm-related files
const pnpmFiles = ["pnpm-lock.yaml", ".pnpmrc", "pnpm-workspace.yaml"]

pnpmFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`Removing pnpm file: ${file}`)
    fs.unlinkSync(filePath)
  }
})

// 5. Clean build cache
const cacheDirectories = [".next", ".vercel/output", "node_modules/.cache"]

cacheDirectories.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir)
  if (fs.existsSync(dirPath)) {
    console.log(`Removing cache directory: ${dir}`)
    try {
      fs.rmSync(dirPath, { recursive: true, force: true })
    } catch (err) {
      console.error(`Error removing ${dir}:`, err)
    }
  }
})

// 6. Clean up environment files
const essentialEnvFiles = [".env.development", ".env.production"]

// Get all .env* files
const allEnvFiles = fs
  .readdirSync(".")
  .filter((file) => file.startsWith(".env") || file.endsWith(".env") || file.includes(".env."))

console.log("Found environment files:", allEnvFiles)

// Delete all except essential files
allEnvFiles.forEach((file) => {
  if (!essentialEnvFiles.includes(file)) {
    try {
      fs.unlinkSync(file)
      console.log(`Deleted environment file: ${file}`)
    } catch (err) {
      console.error(`Error deleting ${file}:`, err)
    }
  }
})

console.log("Project cleanup completed successfully!")
console.log("Next steps:")
console.log('1. Run "npm install" to reinstall dependencies')
console.log('2. Run "npm run build" to build the project')
console.log('3. Run "npm start" to start the production server')
