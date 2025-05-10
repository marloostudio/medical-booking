import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}

export async function POST() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}

export async function PUT() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}

export async function DELETE() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}

export async function PATCH() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}

export async function HEAD() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}

export async function OPTIONS() {
  return NextResponse.redirect(new URL("/dashboard", "https://example.com"))
}
