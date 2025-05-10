import { Suspense } from "react"
import type { Metadata } from "next"
import { MultiStepSignup } from "@/components/auth/multi-step-signup"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Sign Up | BookingLink",
  description: "Create your BookingLink clinic account",
}

// This function ensures the page is not cached
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-xl">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-primary-600 text-white rounded-md w-10 h-10 flex items-center justify-center mr-2">
              <span className="font-bold">BL</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">BookingLink</h1>
          </div>

          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">Create your clinic account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Start managing appointments efficiently</p>

          <Suspense fallback={<div className="mt-8 text-center">Loading signup...</div>}>
            <div className="mt-8">
              <MultiStepSignup />
            </div>
          </Suspense>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Log in
            </a>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-primary-50">
          <div className="relative w-full h-full">
            <Image
              src="/woman-clinic-manager.png"
              alt="Clinic Manager using BookingLink"
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
