const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findFiles(filePath, fileList)
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".js")) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Find all files in the app directory
const files = findFiles("./app")

// Check each file for useSearchParams and remove it
let modifiedFiles = 0

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8")

  if (content.includes("useSearchParams")) {
    console.log(`Found useSearchParams in: ${file}`)

    // Replace useSearchParams with a dummy function
    const newContent = content
      .replace(/import\s*{\s*[^}]*useSearchParams[^}]*}\s*from\s*['"]next\/navigation['"]/g, (match) => {
        return match.replace("useSearchParams", "/* useSearchParams */")
      })
      .replace(/useSearchParams$$$$/g, "/* Removed useSearchParams */ ({})")

    fs.writeFileSync(file, newContent, "utf8")
    modifiedFiles++

    console.log(`Modified: ${file}`)
  }
})

console.log(`Modified ${modifiedFiles} files to remove useSearchParams.`)
console.log("Script complete.")
