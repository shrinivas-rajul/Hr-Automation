import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`PATCH /api/positions/${params.id} - Starting to process request`)
    
    const authResult = await auth()
    const userId = authResult?.userId
    
    console.log("Auth result:", { userId: userId || "Not authenticated" })

    if (!userId) {
      console.log(`PATCH /api/positions/${params.id} - Unauthorized request`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const positionId = params.id
    console.log(`PATCH /api/positions/${params.id} - Request data:`, data)

    // Get the user from the database using Clerk ID
    console.log("Finding user with clerkId:", userId)
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (!user) {
      console.log(`PATCH /api/positions/${params.id} - User not found in database for clerkId:`, userId)
      return NextResponse.json({ 
        error: "User not found",
        details: "No user record exists for the authenticated user."
      }, { status: 404 })
    }

    console.log("User found:", { userId: user.id, name: user.name })

    // Check if the position exists
    console.log(`Finding position with id: ${positionId}`)
    const existingPosition = await prisma.position.findUnique({
      where: {
        id: positionId,
      },
    })

    if (!existingPosition) {
      console.log(`PATCH /api/positions/${params.id} - Position not found with id:`, positionId)
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    console.log("Position found, updating with data:", data)

    // Update the position
    const position = await prisma.position.update({
      where: {
        id: positionId,
      },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        department: data.department !== undefined ? data.department : undefined,
        location: data.location !== undefined ? data.location : undefined,
        type: data.type !== undefined ? data.type : undefined,
        description: data.description !== undefined ? data.description : undefined,
        requirements: data.requirements !== undefined ? data.requirements : undefined,
        status: data.status !== undefined ? data.status : undefined,
      },
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

    console.log("Position updated successfully:", { id: position.id, title: position.title })
    return NextResponse.json(position)
  } catch (error) {
    console.error("Error updating position:", error)
    
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
      error: "Failed to update position",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const positionId = params.id

    // Get the user from the database using Clerk ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if the position exists and belongs to the user
    const existingPosition = await prisma.position.findUnique({
      where: {
        id: positionId,
      },
    })

    if (!existingPosition) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    // Check if there are any applications for this position
    const applications = await prisma.application.findMany({
      where: {
        positionId: positionId,
      },
    })

    if (applications.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete position with applications",
          message: "This position has active applications and cannot be deleted.",
        },
        { status: 400 }
      )
    }

    // Delete the position
    await prisma.position.delete({
      where: {
        id: positionId,
      },
    })

    return NextResponse.json({ success: true, message: "Position deleted successfully" })
  } catch (error) {
    console.error("Error deleting position:", error)
    return NextResponse.json({ error: "Failed to delete position" }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const positionId = params.id

    // Get the position with applications
    const position = await prisma.position.findUnique({
      where: {
        id: positionId,
      },
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

    if (!position) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    return NextResponse.json(position)
  } catch (error) {
    console.error("Error fetching position:", error)
    return NextResponse.json({ error: "Failed to fetch position" }, { status: 500 })
  }
} 