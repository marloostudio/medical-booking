const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
}

console.log(`${colors.cyan}Starting clean build process...${colors.reset}`)

// Step 1: Remove .next directory
console.log(`${colors.yellow}Removing .next directory...${colors.reset}`)
try {
  if (fs.existsSync(path.join(process.cwd(), ".next"))) {
    fs.rmSync(path.join(process.cwd(), ".next"), { recursive: true, force: true })
    console.log(`${colors.green}Successfully removed .next directory${colors.reset}`)
  } else {
    console.log(`${colors.yellow}.next directory does not exist, skipping...${colors.reset}`)
  }
} catch (error) {
  console.error(`${colors.red}Error removing .next directory:${colors.reset}`, error)
  process.exit(1)
}

// Step 2: Clear npm cache
console.log(`${colors.yellow}Clearing npm cache...${colors.reset}`)
try {
  execSync("npm cache clean --force", { stdio: "inherit" })
  console.log(`${colors.green}Successfully cleared npm cache${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error clearing npm cache:${colors.reset}`, error)
  process.exit(1)
}

// Step 3: Install dependencies
console.log(`${colors.yellow}Installing dependencies...${colors.reset}`)
try {
  execSync("npm install", { stdio: "inherit" })
  console.log(`${colors.green}Successfully installed dependencies${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error installing dependencies:${colors.reset}`, error)
  process.exit(1)
}

// Step 4: Build the project
console.log(`${colors.yellow}Building the project...${colors.reset}`)
try {
  execSync("npm run build", { stdio: "inherit" })
  console.log(`${colors.green}Successfully built the project${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error building the project:${colors.reset}`, error)
  process.exit(1)
}

console.log(`${colors.cyan}Clean build process completed successfully!${colors.reset}`)
