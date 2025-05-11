const { execSync } = require("child_process")

console.log("Ensuring polyfills are installed...")
try {
  execSync("node install-polyfills.js", { stdio: "inherit" })
  console.log("Starting build process...")
  execSync("next build", { stdio: "inherit" })
  console.log("Build completed successfully!")
} catch (error) {
  console.error("Build failed:", error)
  process.exit(1)
}
