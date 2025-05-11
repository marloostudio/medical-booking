// This is a static icon component, not an API route
// Removed any GET exports as they're not needed for an icon component

export default function PatientsIcon() {
  return null
}

// Generate an icon image if needed
export function generateImageMetadata() {
  return [
    {
      contentType: "image/svg+xml",
      size: { width: 48, height: 48 },
      id: "patients-icon",
    },
  ]
}
