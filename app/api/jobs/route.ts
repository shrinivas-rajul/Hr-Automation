import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch jobs from both tables
    const [jobs, positions] = await Promise.all([
      prisma.job.findMany({
        orderBy: {
          createdAt: 'desc' as const
        }
      }),
      prisma.position.findMany({
        where: {
          status: "Open"
        },
        orderBy: {
          postedDate: 'desc' as const
        }
      })
    ])

    // Transform positions to match job format
    const formattedPositions = positions.map(position => ({
      id: position.id,
      title: position.title,
      company: "Our Company", // Default value since positions don't have company
      location: position.location,
      description: position.description,
      requirements: position.requirements,
      type: position.type,
      department: position.department,
      createdAt: position.createdAt.toISOString(),
      postedDate: position.postedDate.toISOString(),
    }))

    // Transform jobs to ensure consistent format
    const formattedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      type: job.type,
      department: "General", // Default value since jobs don't have department
      createdAt: job.createdAt.toISOString(),
      postedDate: job.createdAt.toISOString(), // Jobs use createdAt as postedDate
    }))

    // Combine and sort by date
    const allJobs = [...formattedJobs, ...formattedPositions].sort(
      (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    )

    return NextResponse.json(allJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
} 