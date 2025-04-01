import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    console.log("POST /api/positions - Starting to process request")
    
    const authResult = await auth()
    const userId = authResult?.userId
    
    console.log("Auth result:", { userId: userId || "Not authenticated" })

    if (!userId) {
      console.log("POST /api/positions - Unauthorized request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("POST /api/positions - Request data:", data)

    // Get the user from the database using Clerk ID
    console.log("Finding user with clerkId:", userId)
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (!user) {
      console.log("POST /api/positions - User not found in database for clerkId:", userId)
      return NextResponse.json({ 
        error: "User not found",
        details: "No user record exists for the authenticated user. Please ensure your user profile is set up."
      }, { status: 404 })
    }

    console.log("User found:", { userId: user.id, name: user.name })
    
    // Validate required fields
    const requiredFields = ['title', 'department', 'location', 'type', 'description', 'requirements']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      console.log("POST /api/positions - Missing required fields:", missingFields)
      return NextResponse.json({ 
        error: "Missing required fields", 
        details: `The following fields are required: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Create a new position
    console.log("Creating position with data:", { ...data, userId: user.id })
    const position = await prisma.position.create({
      data: {
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
        requirements: data.requirements,
        userId: user.id,
      },
    })

    console.log("Position created successfully:", { id: position.id, title: position.title })
    return NextResponse.json(position)
  } catch (error) {
    console.error("Error creating position:", error)
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    
    // Check for Prisma-specific errors
    const isPrismaError = error instanceof Error && 
      (error.name === 'PrismaClientKnownRequestError' || 
       error.name === 'PrismaClientValidationError')
    
    if (isPrismaError) {
      console.error("Prisma error details:", JSON.stringify(error, null, 2))
    }
    
    return NextResponse.json({ 
      error: "Failed to create position",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      include: {
        applications: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(positions)
  } catch (error) {
    console.error("Error fetching positions:", error)
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 })
  }
}

