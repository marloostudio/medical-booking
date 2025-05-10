const fs = require("fs")
const path = require("path")

function searchFilesForString(dir, searchString) {
  const results = []

  function searchInDirectory(directory) {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      const filePath = path.join(directory, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        searchInDirectory(filePath)
      } else if (
        stat.isFile() &&
        (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx"))
      ) {
        try {
          const content = fs.readFileSync(filePath, "utf8")
          if (content.includes(searchString)) {
            results.push({
              file: filePath,
              line: content.split("\n").findIndex((line) => line.includes(searchString)) + 1,
            })
          }
        } catch (err) {
          console.error(`Error reading file ${filePath}: ${err.message}`)
        }
      }
    }
  }

  searchInDirectory(dir)
  return results
}

// Search for PatientDashboardContent in the project
const results = searchFilesForString("./app", "PatientDashboardContent")

console.log('Files containing "PatientDashboardContent":')
results.forEach((result) => {
  console.log(`${result.file} (line ${result.line})`)
})
