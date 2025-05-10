import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function V0DemoLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl">
            <Skeleton className="h-8 w-40 bg-blue-400" />
          </CardTitle>
          <CardDescription className="text-blue-50">
            <Skeleton className="h-4 w-56 bg-blue-400" />
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-40" />
        </CardFooter>
      </Card>
    </div>
  )
}

export default V0DemoLoading
