import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const authResult = await auth()
    const userId = authResult?.userId
    
    console.log("Auth result from test API:", { userId })

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's clerkId from the request body as a fallback
    const data = await request.json()
    const clerkId = data.clerkId || userId
    
    console.log("Looking up user with clerkId:", clerkId)

    // Get the user from the database using Clerk ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    })

    if (!user) {
      console.log("User record not found for clerkId:", clerkId)
      
      // Try to find if any users exist at all
      const userCount = await prisma.user.count()
      console.log("Total user count in database:", userCount)
      
      const firstUser = userCount > 0 ? await prisma.user.findFirst() : null
      
      return NextResponse.json({ 
        error: "User record not found", 
        clerkId: clerkId,
        userCount: userCount,
        firstUserSample: firstUser ? {
          id: firstUser.id,
          clerkId: firstUser.clerkId,
          name: firstUser.name,
        } : null 
      }, { status: 404 })
    }

    // Return user info
    return NextResponse.json({
      success: true,
      userRecord: {
        id: user.id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }
    })
  } catch (error) {
    console.error("Error testing user record:", error)
    return NextResponse.json({ 
      error: "Failed to test user record",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
} 