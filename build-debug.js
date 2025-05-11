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

console.log(`${colors.bright}${colors.blue}Starting debug build process...${colors.reset}`)

// Step 1: Clean up
console.log(`${colors.yellow}Cleaning up...${colors.reset}`)
try {
  if (fs.existsSync(".next")) {
    fs.rmSync(".next", { recursive: true, force: true })
  }
  console.log(`${colors.green}✓ Cleanup completed${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error during cleanup:${colors.reset}`, error)
}

// Step 2: Check for problematic files
console.log(`${colors.yellow}Checking for problematic files...${colors.reset}`)
const problematicExtensions = [".babelrc", ".npmrc", "pnpm-workspace.yaml", "pnpm-lock.yaml"]
let foundProblematicFiles = false

problematicExtensions.forEach((ext) => {
  if (fs.existsSync(ext)) {
    console.log(`${colors.red}Found problematic file: ${ext}${colors.reset}`)
    foundProblematicFiles = true
  }
})

if (!foundProblematicFiles) {
  console.log(`${colors.green}✓ No problematic files found${colors.reset}`)
}

// Step 3: Check next.config.js
console.log(`${colors.yellow}Checking next.config.js...${colors.reset}`)
try {
  const nextConfig = fs.readFileSync("next.config.js", "utf8")
  const simplifiedConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  }
}

module.exports = nextConfig
  `

  fs.writeFileSync("next.config.js.backup", nextConfig)
  fs.writeFileSync("next.config.js", simplifiedConfig)
  console.log(`${colors.green}✓ Created simplified next.config.js (original backed up)${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Error updating next.config.js:${colors.reset}`, error)
}

// Step 4: Try building with NODE_OPTIONS
console.log(`${colors.yellow}Attempting build with increased memory...${colors.reset}`)
try {
  execSync('NODE_OPTIONS="--max-old-space-size=4096" next build', {
    stdio: "inherit",
    env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=4096" },
  })
  console.log(`${colors.green}✓ Build completed successfully${colors.reset}`)
} catch (error) {
  console.error(`${colors.red}Build failed with increased memory:${colors.reset}`)

  // Step 5: Try building with minimal setup
  console.log(`${colors.yellow}Attempting minimal build...${colors.reset}`)
  try {
    // Create a minimal pages directory with a simple index.js
    if (!fs.existsSync("pages")) {
      fs.mkdirSync("pages")
    }

    const minimalPage = `
export default function Home() {
  return <div>Minimal Page</div>;
}
    `

    fs.writeFileSync("pages/index.js", minimalPage)
    console.log(`${colors.green}✓ Created minimal page${colors.reset}`)

    // Try building again
    try {
      execSync("next build", { stdio: "inherit" })
      console.log(`${colors.green}✓ Minimal build completed successfully${colors.reset}`)
    } catch (buildError) {
      console.error(`${colors.red}Minimal build failed:${colors.reset}`, buildError)
    }
  } catch (setupError) {
    console.error(`${colors.red}Error setting up minimal build:${colors.reset}`, setupError)
  }
}

console.log(`${colors.bright}${colors.blue}Debug build process completed!${colors.reset}`)
