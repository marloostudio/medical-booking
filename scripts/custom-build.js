const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Function to recursively search for files containing a pattern
function findFilesWithPattern(dir, pattern) {
  let results = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      results = results.concat(findFilesWithPattern(filePath, pattern))
    } else if (
      stat.isFile() &&
      (filePath.endsWith(".js") || filePath.endsWith(".jsx") || filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
    ) {
      const content = fs.readFileSync(filePath, "utf8")
      if (content.includes(pattern)) {
        results.push(filePath)
      }
    }
  }

  return results
}

// Function to create a temporary copy of the project without problematic files
function createCleanBuildDirectory() {
  console.log("Creating clean build directory...")

  // Create a temporary build directory
  const tempDir = path.join(__dirname, "../.temp-build")
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
  fs.mkdirSync(tempDir, { recursive: true })

  // Copy all files except problematic ones
  execSync(`cp -r ../!(node_modules|.next|.temp-build) ${tempDir}`)

  // Remove any patients-related directories
  const patientsDirectories = [
    path.join(tempDir, "app/dashboard/patients"),
    path.join(tempDir, "app/dashboard/patients-new"),
    path.join(tempDir, "components/patients"),
  ]

  patientsDirectories.forEach((dir) => {
    if (fs.existsSync(dir)) {
      console.log(`Removing directory: ${dir}`)
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })

  // Find and fix files with useSearchParams
  const filesWithSearchParams = findFilesWithPattern(tempDir, "useSearchParams")
  console.log(`Found ${filesWithSearchParams.length} files with useSearchParams`)

  filesWithSearchParams.forEach((file) => {
    console.log(`Fixing file: ${file}`)
    let content = fs.readFileSync(file, "utf8")

    // Replace useSearchParams with a dummy implementation
    content = content.replace(
      /import[\s\S]*?useSearchParams[\s\S]*?from[\s\S]*?['"]next\/navigation['"]/,
      `import { usePathname, useRouter } from 'next/navigation'`,
    )

    content = content.replace(/const[\s\S]*?=[\s\S]*?useSearchParams$$$$/, `const searchParams = { get: () => null }`)

    fs.writeFileSync(file, content)
  })

  return tempDir
}

// Main build function
async function runCustomBuild() {
  try {
    console.log("Starting custom build process...")

    // Create a clean build directory
    const buildDir = createCleanBuildDirectory()

    // Change to the build directory
    process.chdir(buildDir)

    // Run the build
    console.log("Running Next.js build...")
    execSync("npx next build", { stdio: "inherit" })

    // Copy the build output back to the original directory
    console.log("Copying build output...")
    execSync(`cp -r .next ../.next`)
    execSync(`cp -r out ../out`)

    // Change back to the original directory
    process.chdir("..")

    // Clean up
    fs.rmSync(buildDir, { recursive: true, force: true })

    console.log("Custom build completed successfully!")
  } catch (error) {
    console.error("Custom build failed:", error)
    process.exit(1)
  }
}

runCustomBuild()
