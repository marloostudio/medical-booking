export default function PatientsRobots() {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/dashboard/patients"],
    },
  }
}
