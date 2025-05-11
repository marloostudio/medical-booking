const { execSync } = require("child_process")

console.log("Starting build process...")
try {
  execSync("next build", { stdio: "inherit" })
  console.log("Build completed successfully!")
} catch (error) {
  console.error("Build failed:", error)
  process.exit(1)
}
