import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function POST() {
  try {
    const authResult = await auth()
    const userId = authResult?.userId
    
    console.log("Auth result from init-user API:", { userId })

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Get the current user details from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 })
    }
    
    console.log("Clerk user:", { 
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      primaryEmail: clerkUser.primaryEmailAddress?.emailAddress
    })
    
    // Check if user already exists in the database
    let user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    })
    
    if (user) {
      return NextResponse.json({
        message: "User already exists",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          clerkId: user.clerkId,
        }
      })
    }
    
    // If user doesn't exist, create a new user record
    const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
    const email = clerkUser.primaryEmailAddress?.emailAddress || ''
    
    if (!email) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }
    
    // Create the user record
    user = await prisma.user.create({
      data: {
        name: fullName,
        email: email,
        clerkId: clerkUser.id,
      },
    })
    
    console.log("Created new user:", { id: user.id, name: user.name, email: user.email })
    
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        clerkId: user.clerkId,
      }
    })
  } catch (error) {
    console.error("Error initializing user:", error)
    return NextResponse.json({ 
      error: "Failed to initialize user",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
} 