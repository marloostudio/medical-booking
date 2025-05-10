import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.redirect(new URL("/dashboard/patients-placeholder", "http://localhost:3000"))
}
