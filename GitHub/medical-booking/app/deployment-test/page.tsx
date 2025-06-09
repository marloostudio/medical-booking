export default function DeploymentTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Deployment Test Successful</h1>
      <p className="mt-4">If you can see this page, your basic deployment is working correctly.</p>
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Environment Check:</h2>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
        <p>VERCEL: {process.env.VERCEL ? "Yes" : "No"}</p>
        <p>VERCEL_REGION: {process.env.VERCEL_REGION || "Not set"}</p>
      </div>
    </div>
  )
}
