/**
 * Build performance analyzer script
 * Run with: NODE_ENV=production node scripts/build-analyzer.js
 */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Start time
const startTime = Date.now()

// Create build stats directory
const statsDir = path.join(__dirname, "../.build-stats")
if (!fs.existsSync(statsDir)) {
  fs.mkdirSync(statsDir)
}

// Run the build with timing
console.log("Starting optimized build...")
try {
  // Enable build timing
  process.env.NEXT_TELEMETRY_DISABLED = "1"
  process.env.NEXT_BUILD_STATS = "1"

  // Run the build
  execSync("next build", { stdio: "inherit" })

  // Calculate build time
  const buildTime = ((Date.now() - startTime) / 1000).toFixed(2)

  // Save build stats
  const statsFile = path.join(statsDir, `build-stats-${new Date().toISOString().replace(/:/g, "-")}.json`)
  fs.writeFileSync(
    statsFile,
    JSON.stringify(
      {
        buildTime: `${buildTime}s`,
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
      },
      null,
      2,
    ),
  )

  console.log(`\n✅ Build completed in ${buildTime}s`)
} catch (error) {
  console.error("Build failed:", error)
  process.exit(1)
}
