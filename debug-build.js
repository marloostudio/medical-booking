const { execSync, spawn } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Starting debug build process...")

// Function to run a command and capture output
function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(" ")}`)

    const proc = spawn(command, args, {
      stdio: ["inherit", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""

    proc.stdout.on("data", (data) => {
      const text = data.toString()
      stdout += text
      process.stdout.write(text)
    })

    proc.stderr.on("data", (data) => {
      const text = data.toString()
      stderr += text
      process.stderr.write(text)
    })

    proc.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr })
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })
}

// Clean up any previous build artifacts
console.log("Cleaning up previous build artifacts...")
try {
  if (fs.existsSync(".next")) {
    execSync("rm -rf .next")
  }
} catch (error) {
  console.error("Error cleaning up:", error)
}

// Check for any files using next/font
console.log("Checking for next/font usage...")
try {
  const result = execSync('grep -r "next/font" --include="*.tsx" --include="*.ts" --include="*.js" .').toString()
  if (result) {
    console.log("Found next/font usage:")
    console.log(result)
  }
} catch (error) {
  console.log("No next/font usage found.")
}

// Run the build with detailed logging
console.log("Running build with detailed logging...")
runCommand("npx", ["next", "build", "--debug"])
  .then(() => {
    console.log("Build completed successfully!")
  })
  .catch((error) => {
    console.error("Build failed:", error.message)

    // Try to extract more detailed webpack error information
    try {
      const buildLogs = fs.existsSync(".next/build-error.log")
        ? fs.readFileSync(".next/build-error.log", "utf8")
        : "No build error log found"

      console.log("\nBuild error details:")
      console.log(buildLogs)
    } catch (logError) {
      console.error("Could not read build error logs:", logError)
    }

    process.exit(1)
  })
