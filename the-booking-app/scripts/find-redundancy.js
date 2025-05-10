#!/usr/bin/env node
/**
 * Redundancy Detector for Next.js Projects
 *
 * This script analyzes your codebase to find:
 * - Duplicate functions across files
 * - Similar components
 * - Redundant utility functions
 * - Files with similar content
 * - Unused exports
 * - Redundant API endpoints
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const SIMILARITY_THRESHOLD = 0.8 // 80% similarity threshold
const MIN_LINES_TO_COMPARE = 5 // Minimum lines for comparison
const IGNORE_PATTERNS = [
  "node_modules",
  ".next",
  ".git",
  "public",
  "*.test.ts",
  "*.test.tsx",
  "*.spec.ts",
  "*.spec.tsx",
  "*.d.ts",
]

// File extensions to analyze
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"]

// Output colors
const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
}

console.log(`${COLORS.cyan}=== BookingLink Redundancy Detector ===${COLORS.reset}`)
console.log(`${COLORS.cyan}Analyzing codebase for redundant patterns...${COLORS.reset}\n`)

// Get project root directory
const projectRoot = process.cwd()
console.log(`${COLORS.blue}Project root: ${projectRoot}${COLORS.reset}\n`)

// Function to get all files recursively
function getAllFiles(dir, ignoredPatterns = []) {
  let files = []

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      // Check if path should be ignored
      if (
        ignoredPatterns.some((pattern) => {
          if (pattern.includes("*")) {
            const regex = new RegExp(pattern.replace("*", ".*"))
            return regex.test(fullPath)
          }
          return fullPath.includes(pattern)
        })
      ) {
        continue
      }

      if (entry.isDirectory()) {
        files = [...files, ...getAllFiles(fullPath, ignoredPatterns)]
      } else if (EXTENSIONS.includes(path.extname(entry.name))) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }

  return files
}

// Function to extract functions from a file
function extractFunctions(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const functions = []

    // Match function declarations, arrow functions, and methods
    const functionRegex =
      /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?$$[^)]*$$\s*=>|(\w+)\s*:\s*(?:async\s*)?$$[^)]*$$\s*=>|(?:async\s*)?(\w+)$$[^)]*$$\s*{)/g

    let match
    while ((match = functionRegex.exec(content)) !== null) {
      const name = match[1] || match[2] || match[3] || match[4]
      if (name) {
        functions.push({
          name,
          content: match[0],
          filePath,
        })
      }
    }

    return functions
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    return []
  }
}

// Function to extract React components
function extractComponents(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    const components = []

    // Match function components and class components
    const componentRegex = /(?:function\s+([A-Z]\w+)|const\s+([A-Z]\w+)\s*=\s*(?:$$[^)]*$$|React\.memo$$\s*\([^)]*$$))/g

    let match
    while ((match = componentRegex.exec(content)) !== null) {
      const name = match[1] || match[2]
      if (name) {
        // Extract the component body
        let braceCount = 0
        const startIndex = content.indexOf("{", match.index)
        let endIndex = startIndex

        if (startIndex !== -1) {
          for (let i = startIndex; i < content.length; i++) {
            if (content[i] === "{") braceCount++
            if (content[i] === "}") braceCount--
            if (braceCount === 0) {
              endIndex = i + 1
              break
            }
          }

          const componentBody = content.substring(startIndex, endIndex)

          components.push({
            name,
            content: componentBody,
            filePath,
          })
        }
      }
    }

    return components
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    return []
  }
}

// Function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0

  // Simple Levenshtein distance implementation
  const m = str1.length
  const n = str2.length

  // Create matrix
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0))

  // Initialize first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // deletion
            dp[i][j - 1], // insertion
            dp[i - 1][j - 1], // substitution
          )
      }
    }
  }

  // Calculate similarity as 1 - normalized distance
  const maxLength = Math.max(m, n)
  return maxLength === 0 ? 1 : 1 - dp[m][n] / maxLength
}

// Function to find similar functions
function findSimilarFunctions(allFunctions) {
  const similarFunctions = []

  for (let i = 0; i < allFunctions.length; i++) {
    for (let j = i + 1; j < allFunctions.length; j++) {
      const func1 = allFunctions[i]
      const func2 = allFunctions[j]

      // Skip if functions are from the same file
      if (func1.filePath === func2.filePath) continue

      const similarity = calculateSimilarity(func1.content, func2.content)

      if (similarity >= SIMILARITY_THRESHOLD) {
        similarFunctions.push({
          function1: func1,
          function2: func2,
          similarity: similarity.toFixed(2),
        })
      }
    }
  }

  return similarFunctions
}

// Function to find similar components
function findSimilarComponents(allComponents) {
  const similarComponents = []

  for (let i = 0; i < allComponents.length; i++) {
    for (let j = i + 1; j < allComponents.length; j++) {
      const comp1 = allComponents[i]
      const comp2 = allComponents[j]

      // Skip if components are from the same file
      if (comp1.filePath === comp2.filePath) continue

      const similarity = calculateSimilarity(comp1.content, comp2.content)

      if (similarity >= SIMILARITY_THRESHOLD) {
        similarComponents.push({
          component1: comp1,
          component2: comp2,
          similarity: similarity.toFixed(2),
        })
      }
    }
  }

  return similarComponents
}

// Function to find similar files
function findSimilarFiles(allFiles) {
  const similarFiles = []

  for (let i = 0; i < allFiles.length; i++) {
    for (let j = i + 1; j < allFiles.length; j++) {
      const file1 = allFiles[i]
      const file2 = allFiles[j]

      try {
        const content1 = fs.readFileSync(file1, "utf8")
        const content2 = fs.readFileSync(file2, "utf8")

        // Skip if files are too small
        if (content1.split("\n").length < MIN_LINES_TO_COMPARE || content2.split("\n").length < MIN_LINES_TO_COMPARE) {
          continue
        }

        const similarity = calculateSimilarity(content1, content2)

        if (similarity >= SIMILARITY_THRESHOLD) {
          similarFiles.push({
            file1,
            file2,
            similarity: similarity.toFixed(2),
          })
        }
      } catch (error) {
        console.error(`Error comparing files ${file1} and ${file2}:`, error)
      }
    }
  }

  return similarFiles
}

// Function to find unused exports
function findUnusedExports(allFiles) {
  const exports = []
  const imports = []

  // Extract all exports
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, "utf8")

      // Match export declarations
      const exportRegex = /export\s+(?:const|function|class|let|var|default|type|interface)\s+(\w+)/g
      let match
      while ((match = exportRegex.exec(content)) !== null) {
        if (match[1]) {
          exports.push({
            name: match[1],
            filePath: file,
          })
        }
      }

      // Match named exports
      const namedExportRegex = /export\s+{\s*([^}]+)\s*}/g
      while ((match = namedExportRegex.exec(content)) !== null) {
        if (match[1]) {
          const exportedNames = match[1].split(",").map((name) => name.trim().split(" as ")[0].trim())
          for (const name of exportedNames) {
            if (name) {
              exports.push({
                name,
                filePath: file,
              })
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error processing exports in file ${file}:`, error)
    }
  }

  // Extract all imports
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, "utf8")

      // Match import declarations
      const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from/g
      let match
      while ((match = importRegex.exec(content)) !== null) {
        if (match[1]) {
          // Named imports
          const importedNames = match[1].split(",").map((name) => name.trim().split(" as ")[0].trim())
          for (const name of importedNames) {
            if (name && name !== "type") {
              // Skip 'type' keyword in TypeScript imports
              imports.push(name)
            }
          }
        } else if (match[2]) {
          // Default import
          imports.push(match[2])
        }
      }
    } catch (error) {
      console.error(`Error processing imports in file ${file}:`, error)
    }
  }

  // Find exports that are not imported anywhere
  const unusedExports = exports.filter((exp) => {
    // Skip default exports
    if (exp.name === "default") return false

    return !imports.includes(exp.name)
  })

  return unusedExports
}

// Function to find redundant API endpoints
function findRedundantApiEndpoints(allFiles) {
  const apiEndpoints = []
  const redundantEndpoints = []

  // Extract API endpoints
  const apiFiles = allFiles.filter((file) => file.includes("/api/") && file.includes("route.ts"))

  for (const file of apiFiles) {
    try {
      const content = fs.readFileSync(file, "utf8")
      const relativePath = path.relative(projectRoot, file)

      // Extract the API path from the file path
      const apiPath =
        "/" +
        relativePath
          .replace(/^app\/api\//, "")
          .replace(/\/route\.ts$/, "")
          .replace(/\[([^\]]+)\]/g, ":$1")

      // Determine HTTP methods
      const methods = []
      if (content.includes("export async function GET")) methods.push("GET")
      if (content.includes("export async function POST")) methods.push("POST")
      if (content.includes("export async function PUT")) methods.push("PUT")
      if (content.includes("export async function DELETE")) methods.push("DELETE")
      if (content.includes("export async function PATCH")) methods.push("PATCH")

      apiEndpoints.push({
        path: apiPath,
        methods,
        filePath: file,
      })
    } catch (error) {
      console.error(`Error processing API file ${file}:`, error)
    }
  }

  // Find endpoints with similar paths
  for (let i = 0; i < apiEndpoints.length; i++) {
    for (let j = i + 1; j < apiEndpoints.length; j++) {
      const endpoint1 = apiEndpoints[i]
      const endpoint2 = apiEndpoints[j]

      // Check if paths are similar (ignoring parameter names)
      const path1Parts = endpoint1.path.split("/").filter(Boolean)
      const path2Parts = endpoint2.path.split("/").filter(Boolean)

      if (path1Parts.length === path2Parts.length) {
        let similarParts = 0
        for (let k = 0; k < path1Parts.length; k++) {
          if (path1Parts[k] === path2Parts[k] || (path1Parts[k].startsWith(":") && path2Parts[k].startsWith(":"))) {
            similarParts++
          }
        }

        const similarity = similarParts / path1Parts.length
        if (similarity >= SIMILARITY_THRESHOLD) {
          // Check if methods overlap
          const overlappingMethods = endpoint1.methods.filter((method) => endpoint2.methods.includes(method))

          if (overlappingMethods.length > 0) {
            redundantEndpoints.push({
              endpoint1,
              endpoint2,
              overlappingMethods,
              similarity: similarity.toFixed(2),
            })
          }
        }
      }
    }
  }

  return redundantEndpoints
}

// Main execution
try {
  console.log(`${COLORS.yellow}Scanning files...${COLORS.reset}`)
  const allFiles = getAllFiles(projectRoot, IGNORE_PATTERNS)
  console.log(`${COLORS.green}Found ${allFiles.length} files to analyze${COLORS.reset}\n`)

  // Extract functions and components
  console.log(`${COLORS.yellow}Extracting functions and components...${COLORS.reset}`)
  let allFunctions = []
  let allComponents = []

  for (const file of allFiles) {
    allFunctions = [...allFunctions, ...extractFunctions(file)]
    allComponents = [...allComponents, ...extractComponents(file)]
  }

  console.log(
    `${COLORS.green}Extracted ${allFunctions.length} functions and ${allComponents.length} components${COLORS.reset}\n`,
  )

  // Find similar functions
  console.log(`${COLORS.yellow}Finding similar functions...${COLORS.reset}`)
  const similarFunctions = findSimilarFunctions(allFunctions)
  console.log(`${COLORS.green}Found ${similarFunctions.length} similar function pairs${COLORS.reset}\n`)

  // Find similar components
  console.log(`${COLORS.yellow}Finding similar components...${COLORS.reset}`)
  const similarComponents = findSimilarComponents(allComponents)
  console.log(`${COLORS.green}Found ${similarComponents.length} similar component pairs${COLORS.reset}\n`)

  // Find similar files
  console.log(`${COLORS.yellow}Finding similar files...${COLORS.reset}`)
  const similarFiles = findSimilarFiles(allFiles)
  console.log(`${COLORS.green}Found ${similarFiles.length} similar file pairs${COLORS.reset}\n`)

  // Find unused exports
  console.log(`${COLORS.yellow}Finding unused exports...${COLORS.reset}`)
  const unusedExports = findUnusedExports(allFiles)
  console.log(`${COLORS.green}Found ${unusedExports.length} unused exports${COLORS.reset}\n`)

  // Find redundant API endpoints
  console.log(`${COLORS.yellow}Finding redundant API endpoints...${COLORS.reset}`)
  const redundantEndpoints = findRedundantApiEndpoints(allFiles)
  console.log(
    `${COLORS.green}Found ${redundantEndpoints.length} potentially redundant API endpoint pairs${COLORS.reset}\n`,
  )

  // Generate report
  console.log(`${COLORS.magenta}=== REDUNDANCY REPORT ===${COLORS.reset}\n`)

  // Report similar functions
  if (similarFunctions.length > 0) {
    console.log(`${COLORS.cyan}Similar Functions:${COLORS.reset}`)
    similarFunctions.forEach((pair, index) => {
      console.log(`\n${COLORS.yellow}Pair ${index + 1} (${pair.similarity} similarity):${COLORS.reset}`)
      console.log(`  1. ${COLORS.green}${pair.function1.name}${COLORS.reset} in ${pair.function1.filePath}`)
      console.log(`  2. ${COLORS.green}${pair.function2.name}${COLORS.reset} in ${pair.function2.filePath}`)
    })
    console.log("\n")
  }

  // Report similar components
  if (similarComponents.length > 0) {
    console.log(`${COLORS.cyan}Similar Components:${COLORS.reset}`)
    similarComponents.forEach((pair, index) => {
      console.log(`\n${COLORS.yellow}Pair ${index + 1} (${pair.similarity} similarity):${COLORS.reset}`)
      console.log(`  1. ${COLORS.green}${pair.component1.name}${COLORS.reset} in ${pair.component1.filePath}`)
      console.log(`  2. ${COLORS.green}${pair.component2.name}${COLORS.reset} in ${pair.component2.filePath}`)
    })
    console.log("\n")
  }

  // Report similar files
  if (similarFiles.length > 0) {
    console.log(`${COLORS.cyan}Similar Files:${COLORS.reset}`)
    similarFiles.forEach((pair, index) => {
      console.log(`\n${COLORS.yellow}Pair ${index + 1} (${pair.similarity} similarity):${COLORS.reset}`)
      console.log(`  1. ${pair.file1}`)
      console.log(`  2. ${pair.file2}`)
    })
    console.log("\n")
  }

  // Report unused exports
  if (unusedExports.length > 0) {
    console.log(`${COLORS.cyan}Unused Exports:${COLORS.reset}`)
    unusedExports.forEach((exp, index) => {
      console.log(`  ${index + 1}. ${COLORS.green}${exp.name}${COLORS.reset} in ${exp.filePath}`)
    })
    console.log("\n")
  }

  // Report redundant API endpoints
  if (redundantEndpoints.length > 0) {
    console.log(`${COLORS.cyan}Potentially Redundant API Endpoints:${COLORS.reset}`)
    redundantEndpoints.forEach((pair, index) => {
      console.log(`\n${COLORS.yellow}Pair ${index + 1} (${pair.similarity} similarity):${COLORS.reset}`)
      console.log(
        `  1. ${COLORS.green}${pair.endpoint1.path}${COLORS.reset} [${pair.endpoint1.methods.join(", ")}] in ${pair.endpoint1.filePath}`,
      )
      console.log(
        `  2. ${COLORS.green}${pair.endpoint2.path}${COLORS.reset} [${pair.endpoint2.methods.join(", ")}] in ${pair.endpoint2.filePath}`,
      )
      console.log(`  Overlapping methods: ${COLORS.red}${pair.overlappingMethods.join(", ")}${COLORS.reset}`)
    })
    console.log("\n")
  }

  // Generate recommendations
  console.log(`${COLORS.magenta}=== RECOMMENDATIONS ===${COLORS.reset}\n`)

  if (similarFunctions.length > 0) {
    console.log(`${COLORS.cyan}Function Recommendations:${COLORS.reset}`)
    console.log(`1. Create shared utility functions in a central location (e.g., lib/utils.ts)`)
    console.log(`2. Replace duplicate functions with imports from the shared utility file`)
    console.log(
      `3. Consider creating specialized utility files for different domains (date utils, string utils, etc.)\n`,
    )
  }

  if (similarComponents.length > 0) {
    console.log(`${COLORS.cyan}Component Recommendations:${COLORS.reset}`)
    console.log(`1. Create base components that can be extended or composed`)
    console.log(`2. Use props to customize behavior instead of creating similar components`)
    console.log(`3. Consider using higher-order components or render props for shared functionality\n`)
  }

  if (similarFiles.length > 0) {
    console.log(`${COLORS.cyan}File Structure Recommendations:${COLORS.reset}`)
    console.log(`1. Merge similar files where appropriate`)
    console.log(`2. Extract shared logic into utility files`)
    console.log(`3. Consider using a more modular approach with smaller, focused files\n`)
  }

  if (unusedExports.length > 0) {
    console.log(`${COLORS.cyan}Unused Export Recommendations:${COLORS.reset}`)
    console.log(`1. Remove unused exports to reduce bundle size`)
    console.log(`2. If exports are for testing, mark them with a comment or move to a separate file`)
    console.log(`3. Consider using a linter rule to catch unused exports automatically\n`)
  }

  if (redundantEndpoints.length > 0) {
    console.log(`${COLORS.cyan}API Endpoint Recommendations:${COLORS.reset}`)
    console.log(`1. Consolidate similar endpoints into a single, more flexible endpoint`)
    console.log(`2. Use query parameters instead of creating multiple similar endpoints`)
    console.log(`3. Consider implementing a more RESTful API design\n`)
  }

  console.log(`${COLORS.magenta}=== NEXT STEPS ===${COLORS.reset}\n`)
  console.log(`1. Review the identified redundancies and determine which ones to address`)
  console.log(`2. Create a plan for refactoring, starting with the most critical areas`)
  console.log(`3. Implement changes incrementally, testing thoroughly after each change`)
  console.log(`4. Consider setting up linting rules to prevent future redundancy`)
  console.log(`5. Run this script periodically to monitor code quality\n`)

  // Save report to file
  const reportPath = path.join(projectRoot, "redundancy-report.md")

  // Create a simplified version of the report for the file
  let reportContent = "# Redundancy Analysis Report\n\n"
  reportContent += `Generated on: ${new Date().toLocaleString()}\n\n`

  reportContent += "## Similar Functions\n\n"
  if (similarFunctions.length > 0) {
    similarFunctions.forEach((pair, index) => {
      reportContent += `### Pair ${index + 1} (${pair.similarity} similarity)\n`
      reportContent += `1. \`${pair.function1.name}\` in \`${pair.function1.filePath}\`\n`
      reportContent += `2. \`${pair.function2.name}\` in \`${pair.function2.filePath}\`\n\n`
    })
  } else {
    reportContent += "No similar functions found.\n\n"
  }

  reportContent += "## Similar Components\n\n"
  if (similarComponents.length > 0) {
    similarComponents.forEach((pair, index) => {
      reportContent += `### Pair ${index + 1} (${pair.similarity} similarity)\n`
      reportContent += `1. \`${pair.component1.name}\` in \`${pair.component1.filePath}\`\n`
      reportContent += `2. \`${pair.component2.name}\` in \`${pair.component2.filePath}\`\n\n`
    })
  } else {
    reportContent += "No similar components found.\n\n"
  }

  reportContent += "## Similar Files\n\n"
  if (similarFiles.length > 0) {
    similarFiles.forEach((pair, index) => {
      reportContent += `### Pair ${index + 1} (${pair.similarity} similarity)\n`
      reportContent += `1. \`${pair.file1}\`\n`
      reportContent += `2. \`${pair.file2}\`\n\n`
    })
  } else {
    reportContent += "No similar files found.\n\n"
  }

  reportContent += "## Unused Exports\n\n"
  if (unusedExports.length > 0) {
    unusedExports.forEach((exp, index) => {
      reportContent += `${index + 1}. \`${exp.name}\` in \`${exp.filePath}\`\n`
    })
    reportContent += "\n"
  } else {
    reportContent += "No unused exports found.\n\n"
  }

  reportContent += "## Potentially Redundant API Endpoints\n\n"
  if (redundantEndpoints.length > 0) {
    redundantEndpoints.forEach((pair, index) => {
      reportContent += `### Pair ${index + 1} (${pair.similarity} similarity)\n`
      reportContent += `1. \`${pair.endpoint1.path}\` [${pair.endpoint1.methods.join(", ")}] in \`${pair.endpoint1.filePath}\`\n`
      reportContent += `2. \`${pair.endpoint2.path}\` [${pair.endpoint2.methods.join(", ")}] in \`${pair.endpoint2.filePath}\`\n`
      reportContent += `Overlapping methods: ${pair.overlappingMethods.join(", ")}\n\n`
    })
  } else {
    reportContent += "No redundant API endpoints found.\n\n"
  }

  reportContent += "## Recommendations\n\n"
  reportContent += "### Function Recommendations\n\n"
  reportContent += "1. Create shared utility functions in a central location (e.g., lib/utils.ts)\n"
  reportContent += "2. Replace duplicate functions with imports from the shared utility file\n"
  reportContent +=
    "3. Consider creating specialized utility files for different domains (date utils, string utils, etc.)\n\n"

  reportContent += "### Component Recommendations\n\n"
  reportContent += "1. Create base components that can be extended or composed\n"
  reportContent += "2. Use props to customize behavior instead of creating similar components\n"
  reportContent += "3. Consider using higher-order components or render props for shared functionality\n\n"

  reportContent += "### File Structure Recommendations\n\n"
  reportContent += "1. Merge similar files where appropriate\n"
  reportContent += "2. Extract shared logic into utility files\n"
  reportContent += "3. Consider using a more modular approach with smaller, focused files\n\n"

  reportContent += "### Unused Export Recommendations\n\n"
  reportContent += "1. Remove unused exports to reduce bundle size\n"
  reportContent += "2. If exports are for testing, mark them with a comment or move to a separate file\n"
  reportContent += "3. Consider using a linter rule to catch unused exports automatically\n\n"

  reportContent += "### API Endpoint Recommendations\n\n"
  reportContent += "1. Consolidate similar endpoints into a single, more flexible endpoint\n"
  reportContent += "2. Use query parameters instead of creating multiple similar endpoints\n"
  reportContent += "3. Consider implementing a more RESTful API design\n\n"

  reportContent += "## Next Steps\n\n"
  reportContent += "1. Review the identified redundancies and determine which ones to address\n"
  reportContent += "2. Create a plan for refactoring, starting with the most critical areas\n"
  reportContent += "3. Implement changes incrementally, testing thoroughly after each change\n"
  reportContent += "4. Consider setting up linting rules to prevent future redundancy\n"
  reportContent += "5. Run this script periodically to monitor code quality\n"

  fs.writeFileSync(reportPath, reportContent)
  console.log(`${COLORS.green}Report saved to ${reportPath}${COLORS.reset}`)
} catch (error) {
  console.error(`${COLORS.red}Error during analysis:${COLORS.reset}`, error)
}
