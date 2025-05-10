import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}
