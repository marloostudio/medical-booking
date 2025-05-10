import { type NextRequest, NextResponse } from "next/server"
import { adminAuth, adminDb } from "@/lib/firebase-admin-server"
import { getServerSession } from "next-auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    // Get user from Firestore
    const userDoc = await adminDb.collection("users").doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userDoc.data()

    return NextResponse.json({
      user: {
        id: userDoc.id,
        ...userData,
      },
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const body = await request.json()

    // Update user in Firestore
    await adminDb
      .collection("users")
      .doc(userId)
      .update({
        ...body,
        updatedAt: new Date(),
      })

    // Update Firebase Auth if email or displayName changed
    if (body.email || body.firstName || body.lastName) {
      const updateData: any = {}

      if (body.email) {
        updateData.email = body.email
      }

      if (body.firstName || body.lastName) {
        updateData.displayName = `${body.firstName || ""} ${body.lastName || ""}`.trim()
      }

      if (Object.keys(updateData).length > 0) {
        await adminAuth.updateUser(userId, updateData)
      }
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id

    // Delete user from Firebase Auth
    await adminAuth.deleteUser(userId)

    // Delete user from Firestore
    await adminDb.collection("users").doc(userId).delete()

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
