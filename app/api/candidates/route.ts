import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Create a new candidate
    const candidate = await prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        resumeUrl: data.resumeUrl || null,
        skills: data.skills.split(",").map((skill: string) => skill.trim()),
        experience: data.experience || null,
      },
    })

    // Create an application for this candidate
    const application = await prisma.application.create({
      data: {
        candidateId: candidate.id,
        positionId: data.positionId,
        // Calculate match score based on job requirements and candidate skills
        // This would be more sophisticated in a real app
        matchScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100 for demo
      },
    })

    return NextResponse.json({
      success: true,
      candidate,
      application,
    })
  } catch (error) {
    console.error("Error creating candidate:", error)
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const positionId = searchParams.get("positionId")

    let candidates

    if (positionId) {
      // Get candidates who applied for a specific position
      candidates = await prisma.candidate.findMany({
        where: {
          applications: {
            some: {
              positionId,
            },
          },
        },
        include: {
          applications: {
            where: {
              positionId,
            },
            include: {
              position: true,
            },
          },
        },
      })
    } else {
      // Get all candidates
      candidates = await prisma.candidate.findMany({
        include: {
          applications: {
            include: {
              position: true,
            },
          },
        },
      })
    }

    return NextResponse.json(candidates)
  } catch (error) {
    console.error("Error fetching candidates:", error)
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 })
  }
}

