export async function GET() {
  // Collect debug information
  const debugInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_REGION: process.env.VERCEL_REGION,
    },
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  }

  return Response.json(debugInfo)
}
