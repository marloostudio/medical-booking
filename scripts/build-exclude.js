// This script runs before the build to ensure problematic routes are excluded
const fs = require("fs")
const path = require("path")

// Routes to exclude
const excludeRoutes = ["app/dashboard/patients", "app/dashboard/patients-new"]

// Function to temporarily rename folders to exclude them from build
function excludeRoutesFromBuild() {
  excludeRoutes.forEach((route) => {
    const routePath = path.join(__dirname, "..", route)
    const excludePath = `${routePath}.excluded`

    if (fs.existsSync(routePath)) {
      console.log(`Excluding ${route} from build`)
      fs.renameSync(routePath, excludePath)
    }
  })
}

// Function to restore folders after build
function restoreExcludedRoutes() {
  excludeRoutes.forEach((route) => {
    const routePath = path.join(__dirname, "..", route)
    const excludePath = `${routePath}.excluded`

    if (fs.existsSync(excludePath)) {
      console.log(`Restoring ${route} after build`)
      fs.renameSync(excludePath, routePath)
    }
  })
}

// Export functions for use in build scripts
module.exports = {
  excludeRoutesFromBuild,
  restoreExcludedRoutes,
}

// If run directly, exclude routes
if (require.main === module) {
  excludeRoutesFromBuild()
}
