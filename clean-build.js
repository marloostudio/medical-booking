const { execSync } = require("child_process")
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

console.log(`${colors.bright}${colors.blue}Starting clean build process...${colors.reset}`)

// Step 1: Remove .next directory
console.log(`${colors.yellow}Removing .next directory...${colors.reset}`)
try {
  if (fs.existsSync(".next")) {
    fs.rmSync(".next", { recursive: true, force: true })
  }
  console.log(`${colors.green}✓ .next directory removed${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error removing .next directory:${colors.reset}`, error)
}

// Step 2: Clear npm cache for the project
console.log(`${colors.yellow}Clearing npm cache...${colors.reset}`)
try {
  execSync("npm cache clean --force", { stdio: "inherit" })
  console.log(`${colors.green}✓ npm cache cleared${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error clearing npm cache:${colors.reset}`, error)
}

// Step 3: Install dependencies
console.log(`${colors.yellow}Installing dependencies...${colors.reset}`)
try {
  execSync("npm install", { stdio: "inherit" })
  console.log(`${colors.green}✓ Dependencies installed${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error installing dependencies:${colors.reset}`, error)
}

// Step 4: Run build
console.log(`${colors.yellow}Running build...${colors.reset}`)
try {
  execSync("next build", { stdio: "inherit" })
  console.log(`${colors.green}✓ Build completed successfully${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Build failed:${colors.reset}`, error)
  process.exit(1)
}

console.log(`${colors.bright}${colors.blue}Clean build process completed!${colors.reset}`)
