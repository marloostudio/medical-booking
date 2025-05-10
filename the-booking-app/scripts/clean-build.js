const { execSync } = require("child_process")

// Clean the build cache and run a fresh build
console.log("Cleaning build cache...")
execSync("rm -rf .next out node_modules/.cache", { stdio: "inherit" })

console.log("Running custom build...")
execSync("node scripts/custom-build.js", { stdio: "inherit" })

console.log("Build completed successfully!")
