import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import prisma from "@/lib/prisma"

// Helper function to generate a meeting URL
// This is a simplified version without actual Google Meet API integration
function generateMeetingUrl(date: Date, candidateName: string): string {
  // In a production environment, this would use Google Calendar API to create an actual meeting
  // For now, we'll generate a fake but consistent URL 
  const formattedDate = date.toISOString().split('T')[0];
  const hash = Buffer.from(`${formattedDate}-${candidateName}-${Math.random()}`).toString('base64').substring(0, 10);
  return `https://meet.google.com/${hash.toLowerCase().replace(/[+/=]/g, '')}`;
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.applicationIds || !data.scheduledFor) {
      return NextResponse.json({ 
        error: "Missing required fields. Please provide applicationIds and scheduledFor." 
      }, { status: 400 })
    }

    // Get the user from the database using Clerk ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create interviews for each application
    const interviews = []

    for (const applicationId of data.applicationIds) {
      // Get the application to access the candidate
      const application = await prisma.application.findUnique({
        where: {
          id: applicationId,
        },
        include: {
          candidate: true,
          position: true,
        },
      })

      if (!application) {
        console.warn(`Application with ID ${applicationId} not found, skipping`);
        continue
      }

      // Generate a consistent meeting URL
      const scheduledDate = new Date(data.scheduledFor);
      const meetingUrl = generateMeetingUrl(scheduledDate, application.candidate.name);

      try {
        // Create the interview
        const interview = await prisma.interview.create({
          data: {
            scheduledFor: scheduledDate,
            duration: data.duration || 60,
            meetingUrl,
            notes: data.notes || "",
            applicationId,
            candidateId: application.candidate.id,
            userId: user.id,
          },
        })

        // Update the application status
        await prisma.application.update({
          where: {
            id: applicationId,
          },
          data: {
            status: "Interview Scheduled",
          },
        })

        interviews.push(interview)

        console.log(`Interview scheduled for ${application.candidate.name} on ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}`);
        
        // In a real app, you would send an email to the candidate here
        console.log(`Email would be sent to ${application.candidate.email} with meeting link ${meetingUrl}`);
      } catch (error) {
        console.error(`Error scheduling interview for application ${applicationId}:`, error);
      }
    }

    return NextResponse.json(interviews)
  } catch (error) {
    console.error("Error scheduling interviews:", error)
    return NextResponse.json({ 
      error: "Failed to schedule interviews", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get interviews for this user only
    const interviews = await prisma.interview.findMany({
      where: {
        userId: user.id,
      },
      include: {
        application: {
          include: {
            position: true,
            job: true,
          },
        },
        candidate: true,
        scheduler: true,
      },
      orderBy: {
        scheduledFor: 'asc' as const,
      },
    })

    return NextResponse.json(interviews)
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ 
      error: "Failed to fetch interviews", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}

