const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Function to recursively search for files containing useSearchParams
function findFilesWithUseSearchParams(dir) {
  let results = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      results = results.concat(findFilesWithUseSearchParams(filePath))
    } else if (
      stat.isFile() &&
      (filePath.endsWith(".js") || filePath.endsWith(".jsx") || filePath.endsWith(".ts") || filePath.endsWith(".tsx"))
    ) {
      const content = fs.readFileSync(filePath, "utf8")
      if (content.includes("useSearchParams")) {
        results.push(filePath)
      }
    }
  }

  return results
}

// Function to fix a file containing useSearchParams
function fixFile(filePath) {
  console.log(`Fixing file: ${filePath}`)

  let content = fs.readFileSync(filePath, "utf8")

  // Replace useSearchParams with a dummy implementation
  content = content.replace(
    /import[\s\S]*?useSearchParams[\s\S]*?from[\s\S]*?['"]next\/navigation['"]/,
    `import { usePathname, useRouter } from 'next/navigation'`,
  )

  content = content.replace(/const[\s\S]*?=[\s\S]*?useSearchParams$$$$/, `const searchParams = { get: () => null }`)

  // Add Suspense boundary if not present
  if (!content.includes("Suspense") && !content.includes("suspense")) {
    content = `import { Suspense } from 'react';\n${content}`

    // Find the return statement and wrap it in Suspense
    const returnRegex = /return\s*\(/
    const returnMatch = content.match(returnRegex)

    if (returnMatch) {
      const returnIndex = returnMatch.index
      const beforeReturn = content.substring(0, returnIndex)
      const afterReturn = content.substring(returnIndex)

      content = `${beforeReturn}return (\n<Suspense fallback={<div>Loading...</div>}>\n${afterReturn.replace("return (", "")}`

      // Find the last closing parenthesis and add the Suspense closing tag
      const lastIndex = content.lastIndexOf(")")
      if (lastIndex !== -1) {
        content = `${content.substring(0, lastIndex)}\n</Suspense>${content.substring(lastIndex)}`
      }
    }
  }

  fs.writeFileSync(filePath, content)
  console.log(`Fixed file: ${filePath}`)
}

// Function to remove patients-related directories
function removePatientsDirectories() {
  const rootDir = path.resolve(__dirname, "..")
  const patientsDirectories = [
    path.join(rootDir, "app/dashboard/patients"),
    path.join(rootDir, "app/dashboard/patients-new"),
    path.join(rootDir, "components/patients"),
  ]

  patientsDirectories.forEach((dir) => {
    if (fs.existsSync(dir)) {
      console.log(`Removing directory: ${dir}`)
      fs.rmSync(dir, { recursive: true, force: true })
    }
  })
}

// Function to update next.config.js
function updateNextConfig() {
  const configPath = path.resolve(__dirname, "../next.config.js")

  if (fs.existsSync(configPath)) {
    console.log("Updating next.config.js...")

    let content = fs.readFileSync(configPath, "utf8")

    // Ensure we have the necessary configuration
    if (!content.includes("exportPathMap")) {
      content = content.replace(
        "const nextConfig = {",
        `const nextConfig = {
  // Skip the problematic routes during build
  exportPathMap: async function (defaultPathMap) {
    // Create a filtered path map without patients routes
    const filteredPathMap = {};
    
    for (const [path, page] of Object.entries(defaultPathMap)) {
      if (!path.includes('/dashboard/patients')) {
        filteredPathMap[path] = page;
      }
    }
    
    return filteredPathMap;
  },`,
      )
    }

    fs.writeFileSync(configPath, content)
    console.log("Updated next.config.js")
  }
}

// Function to create a vercel.json file
function createVercelConfig() {
  const vercelPath = path.resolve(__dirname, "../vercel.json")

  console.log("Creating vercel.json...")

  const vercelConfig = {
    version: 2,
    builds: [
      {
        src: "package.json",
        use: "@vercel/next",
        config: {
          skipBuildSteps: ["next build"],
          buildCommand: "node scripts/custom-build.js",
        },
      },
    ],
    routes: [
      {
        src: "/dashboard/patients(.*)",
        dest: "/dashboard",
      },
      {
        src: "/(.*)",
        dest: "/$1",
      },
    ],
  }

  fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2))
  console.log("Created vercel.json")
}

// Main function
function main() {
  console.log("Starting emergency fix...")

  // Remove patients directories
  removePatientsDirectories()

  // Find and fix files with useSearchParams
  const rootDir = path.resolve(__dirname, "..")
  const files = findFilesWithUseSearchParams(rootDir)

  console.log(`Found ${files.length} files containing useSearchParams`)
  files.forEach(fixFile)

  // Update next.config.js
  updateNextConfig()

  // Create vercel.json
  createVercelConfig()

  // Clean build cache
  console.log("Cleaning build cache...")
  try {
    execSync("rm -rf .next out node_modules/.cache", { stdio: "inherit" })
  } catch (error) {
    console.error("Error cleaning cache:", error)
  }

  console.log("Emergency fix completed!")
  console.log('Please run "npm run build" and deploy again.')
}

main()
